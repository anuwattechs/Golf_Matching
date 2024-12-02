import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NullableType } from 'src/shared/types';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';
import { FriendsModel, MemberModel, TagModel } from 'src/schemas/models';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
import { UtilsService } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { AwsService } from 'src/app/common/services/aws/aws.service';
import {
  Profile,
  ProfileForSearch,
  ProfileMain,
  ResultsPaginatedFriendsDto,
} from 'src/schemas/models/dto';
import { FriendStatusEnum } from 'src/shared/enums';
import { ScoresService } from '../scores/scores.service';
import { AuthService } from '../auth/auth.service';
import { AssetsService } from '../assets/assets.service';
import { GolfCoursesService } from '../golf-courses/golf-courses.service';
import { Member } from 'src/schemas';

@Injectable()
export class MembersService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
    private readonly friendsModel: FriendsModel,
    private readonly scoresService: ScoresService,
    private readonly authService: AuthService,
    private readonly assetsService: AssetsService,
    private readonly golfCoursesService: GolfCoursesService,
  ) {}

  async updateProfile(
    input: UpdateProfileDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findById(decoded.userId);

      if (!userRegistered)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
          HttpStatus.BAD_REQUEST,
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
        error.status,
      );
    }
  }

  async changeInviteMode(
    input: ChangeInviteModeDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.memberModel.changeInviteMode(
        decoded.userId,
        input.isInviteAble,
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
        error.status,
      );
    }
  }

  async findOnePersonalInfo(
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      const member = await this.memberModel.findProfileDetailById(
        decoded.userId,
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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfilePicture(
    file: Express.Multer.File,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    if (!file) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'File is required',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          message: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.',
          data: null,
        },
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    const fileNames = `profile-images/${uuidv4()}.${file.originalname.split('.').pop()}`;

    try {
      const member = await this.memberModel.findById(decoded.userId);
      if (!member) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const uploadResult = await this.awsService.uploadFile(
        process.env.AWS_DEFAULT_S3_BUCKET,
        fileNames,
        file.buffer,
        file.mimetype,
        { ACL: 'private' },
      );

      if (!uploadResult || !uploadResult.Location) {
        throw new HttpException(
          'Failed to upload file to S3',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      await this.memberModel.updateProfileImage(
        decoded.userId,
        uploadResult.Key,
      );

      return null;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message || 'An unexpected error occurred',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneProfile(
    _: JwtPayloadType,
    userId: string,
    isShowPrivateInfo: boolean = false,
    // ): Promise<ProfileMain> {
  ): Promise<NullableType<unknown>> {
    try {
      const [member, members, followings, followers] = await Promise.all([
        this.memberModel.findById(userId),
        this.memberModel.findAllProfiles(),
        this.friendsModel
          .getFriendsByUserId(userId, FriendStatusEnum.FOLLOWING)
          .then((res) =>
            res?.filter((r) => r.senderId === userId)?.map((r) => r.receiverId),
          ),
        this.friendsModel
          .getFollowersByUserId(userId, FriendStatusEnum.FOLLOWING)
          .then((res) =>
            res?.filter((r) => r.receiverId === userId)?.map((r) => r.senderId),
          ),
      ]);

      if (!member) {
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.NOT_FOUND,
            message: 'User not found',
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const customUserId = !Boolean(member.customUserId)
        ? await this.authService.generateUniqueCustomUserId()
        : member.customUserId;
      if (!member.customUserId)
        await this.memberModel.updateCustomUserId(userId, customUserId);

      const mapMembers = (ids: string[]) =>
        members
          ?.map((member) => this?.buildProfileForSearch(member))
          ?.filter((m) => ids.includes(m.memberId));

      const mappedFollowings = mapMembers(followings);
      const mappedFollowers = mapMembers(followers);

      // const stats = await this.scoresService.getStats(userId);

      const tags = await this.assetsService.getTags({
        isPublic: false,
      });

      const golfCourses = await this.golfCoursesService.findAll();

      const memberTags = tags?.filter((tag) =>
        member.tags?.includes(tag.tagId),
      );

      const memberGolfCourses = golfCourses?.filter((course) =>
        member.favoriteCourses?.includes(course.golfCourseId),
      );

      /*
      const result: ProfileMain = {
        ...member,
        tags: memberTags || [],
        profileImage: member.profileImage
          ? await this.assetsService.getPresignedSignedUrl(member.profileImage)
          : null,
        stats: stats,
        followingsCount: mappedFollowings?.length || 0,
        followersCount: mappedFollowers?.length || 0,
      };
      */

      const bucketName = this.awsService.getBucketName();

      const result = {
        memberId: member._id,
        customUserId,
        profileImage: member.profileImage
          ? // ? await this.assetsService.getPresignedSignedUrl(member.profileImage)
            await this.awsService.generatePresignedUrl(
              bucketName,
              member.profileImage,
            )
          : // this.awsService.getUrl(bucketName, member.profileImage)
            null,
        profile: {
          yearStart: member.yearStart,
          handicap: 0, //! Mock data
          avgScore: member.avgScore,
          followersCount: mappedFollowings?.length || 0,
          followingsCount: mappedFollowers?.length || 0,
        },
        details: {
          customUserId: member.customUserId,
          email: member.email,
          phoneNo: member.phoneNo,
          facebookId: member.facebookId,
          googleId: member.googleId,
          appleId: member.appleId,
          introduction: member.introduction,
          firstName: member.firstName,
          lastName: member.lastName,
          nickName: member.nickName,
          birthDate: member.birthDate,
          gender: member.gender,
          country: member.country, // country id
          location: member.location, // location id
          occupation: member.occupation,
        },
        lifestyle: {
          tags: memberTags,
          yearStart: member.yearStart,
          avgScore: member.avgScore,
          favoriteCourses: memberGolfCourses, // array not string? register input only string
          countHoleInOne: member.countHoleInOne,
          bestScore: member.bestScore,
          clubBrands: member.clubBrands,
        },
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
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllProfilesWithPagination(
    page: number,
    limit: number,
    filterQuery: Record<string, unknown>,
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
      filterQuery,
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
