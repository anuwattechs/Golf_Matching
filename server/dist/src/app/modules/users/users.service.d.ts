<<<<<<< HEAD
<<<<<<< HEAD
import { User } from 'src/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
=======
import { User } from "src/schemas";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserRepository } from "./repository/user.repository";
import { NullableType } from "src/shared/types/nullable.type";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<any>;
    findByEmail(email: User["email"]): Promise<NullableType<User>>;
    findBySocialIdAndProvider({ socialId, provider, }: {
        socialId: User["socialId"];
        provider: User["provider"];
    }): Promise<NullableType<User>>;
    findAll(): Promise<User[]>;
    update(id: User["id"], payload: Partial<User>): Promise<User | null>;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
import { User } from 'src/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
}
