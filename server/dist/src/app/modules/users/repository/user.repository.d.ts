<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/schemas';
import { AuthProvidersEnum } from 'src/shared/enums';
<<<<<<< HEAD
export declare class UserRepository {
    private userModel;
=======
import { Model } from "mongoose";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "src/schemas";
import { AuthProvidersEnum } from "src/shared/enums";
export declare class UserRepository {
    private readonly userModel;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
export declare class UserRepository {
    private userModel;
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
    constructor(userModel: Model<User>);
    create(data: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User | null>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findBySocialIdAndProvider({ socialId, provider, }: {
        socialId: string;
        provider: AuthProvidersEnum;
    }): Promise<User | null>;
    findAll(): Promise<User[]>;
<<<<<<< HEAD
<<<<<<< HEAD
=======
    update(id: string, data: Partial<User>): Promise<User | null>;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
}
