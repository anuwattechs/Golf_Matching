import { User } from 'src/schemas';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
}
