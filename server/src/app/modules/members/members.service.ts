import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { NullableType } from "src/shared/types";
import { UpdateProfileDto, ChangeInviteModeDto } from "./dto";
import { FriendsModel, MemberModel } from "src/schemas/models";
import { JwtPayloadType } from "src/app/modules/auth/strategies/types/jwt-payload.type";
import { UtilsService } from "src/shared/utils/utils.service";
import { v4 as uuidv4 } from "uuid";
import { AwsService } from "src/app/common/services/aws/aws.service";
import {
  Profile,
  ProfileForSearch,
  ResultsPaginatedFriendsDto,
} from "src/schemas/models/dto";
import { FriendStatusEnum } from "src/shared/enums";
import { ScoresService } from "../scores/scores.service";
import { AssetsService } from "../assets/assets.service";
import { Member } from "src/schemas";

@Injectable()
export class MembersService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
    private readonly friendsModel: FriendsModel,
    private readonly scoresService: ScoresService,
    private readonly assetsService: AssetsService
  ) {}

  async updateProfile(
    input: UpdateProfileDto,
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findById(decoded.userId);

      if (!userRegistered)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe("members.USER_NOT_REGISTERED"),
          HttpStatus.BAD_REQUEST
        );

      /*const updated = */ await this.memberModel.updateById({
        ...input,
        userId: decoded.userId,
      });

      return await this.memberModel.findProfileById(decoded.userId);
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status
      );
    }
  }

  async changeInviteMode(
    input: ChangeInviteModeDto,
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    try {
      await this.memberModel.changeInviteMode(
        decoded.userId,
        input.isInviteAble
      );

      return null;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status
      );
    }
  }

  async findOnePersonalInfo(
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    try {
      const member = await this.memberModel.findProfileDetailById(
        decoded.userId
      );

      return !member ? null : member;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateProfilePicture(
    file: Express.Multer.File,
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    if (!file) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: "File is required",
          data: null,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          message: "Invalid file type. Only JPEG, PNG, and WEBP are allowed.",
          data: null,
        },
        HttpStatus.UNSUPPORTED_MEDIA_TYPE
      );
    }

    const fileNames = `profile-images/${uuidv4()}.${file.originalname.split(".").pop()}`;

    try {
      const member = await this.memberModel.findById(decoded.userId);
      if (!member) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      const uploadResult = await this.awsService.uploadFile(
        process.env.AWS_DEFAULT_S3_BUCKET,
        fileNames,
        file.buffer,
        file.mimetype
      );

      if (!uploadResult || !uploadResult.Location) {
        throw new HttpException(
          "Failed to upload file to S3",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      await this.memberModel.updateProfileImage(
        decoded.userId,
        uploadResult.Key
      );

      return null;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || "An unexpected error occurred",
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOneProfile(
    _: JwtPayloadType,
    userId: string,
    isShowPrivateInfo: boolean = false
  ): Promise<Profile> {
    try {
      const [member, members, followings, followers] = await Promise.all([
        this.memberModel.findProfileById(userId),
        this.memberModel.findAllProfiles(),
        this.friendsModel
          .getFriendsByUserId(userId, FriendStatusEnum.FOLLOWING)
          .then((res) =>
            res?.filter((r) => r.senderId === userId)?.map((r) => r.receiverId)
          ),
        this.friendsModel
          .getFollowersByUserId(userId, FriendStatusEnum.FOLLOWING)
          .then((res) =>
            res?.filter((r) => r.receiverId === userId)?.map((r) => r.senderId)
          ),
      ]);

      if (!member) {
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.NOT_FOUND,
            message: "User not found",
            data: null,
          },
          HttpStatus.NOT_FOUND
        );
      }

      const mapMembers = (ids: string[]) =>
        members
          ?.map((member) => this.buildProfileForSearch(member))
          ?.filter((m) => ids.includes(m.memberId));

      const mappedFollowings = mapMembers(followings);
      const mappedFollowers = mapMembers(followers);

      const stats = await this.scoresService.getStats(userId);

      const result: Profile = {
        ...member,
        profileImage: await this.assetsService.getPresignedSignedUrl(
          member.profileImage
        ),
        stats: stats,
        followingsCount: mappedFollowings?.length || 0,
        followersCount: mappedFollowers?.length || 0,
      };

      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: null,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllProfilesWithPagination(
    page: number,
    limit: number,
    filterQuery: Record<string, unknown>
  ): Promise<ResultsPaginatedFriendsDto> {
    const {
      data,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    } = await this.utilsService.findAllWithPaginationAndFilter(
      this.memberModel.rootMemberModel(),
      page,
      limit,
      filterQuery
    );

    const result = data.map((member) => this.buildProfileForSearch(member));

    return {
      result: result,
      pagination: {
        total: total,
        page: currentPage,
        limit: currentLimit,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
      },
    };
  }

  buildProfileForSearch(member: Member): ProfileForSearch {
    const { _id, firstName, lastName, introduction, profileImage } = member;
    return {
      memberId: _id,
      profileImage: profileImage,
      firstName: firstName,
      lastName: lastName,
      introduction: introduction,
      status: null,
    };
  }
}
