import { Document } from 'mongoose';
import { AuthProvidersEnum } from 'src/shared/enums';
export declare class User extends Document {
    _id: string;
    email: string | null;
    password?: string;
    previousPassword?: string;
    loadPreviousPassword(): void;
    provider: AuthProvidersEnum;
    socialId: string | null;
    isVerified: boolean;
    otp: string;
    otpExpired: Date;
    otpSent: boolean;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}>>;
