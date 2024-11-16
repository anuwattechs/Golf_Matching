import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NullableType } from 'src/shared/types';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';
import { MemberModel } from 'src/schemas/models';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
import { UtilsService } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';
import { AwsService } from 'src/app/common/services/aws/aws.service';
import { ServerSideEncryption } from '@aws-sdk/client-s3';
import { Profile } from 'src/schemas/models/dto';

@Injectable()
export class MembersService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
    private readonly awsService: AwsService,
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

      // if (member.profileImage) {
      //   await this.awsService.deleteFile(
      //     process.env.AWS_DEFAULT_S3_BUCKET,
      //     member.profileImage,
      //   );
      // }

      const uploadResult = await this.awsService.uploadFile(
        process.env.AWS_DEFAULT_S3_BUCKET,
        fileNames,
        file.buffer,
        file.mimetype,
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

      return {
        status: true,
        message: 'Profile picture updated successfully',
        data: uploadResult,
      };
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
    jwtPayload: JwtPayloadType,
    userId: string,
  ): Promise<Profile> {
    try {
      const member = await this.memberModel.findProfileById(userId);

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

      return member;
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
}
