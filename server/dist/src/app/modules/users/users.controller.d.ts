import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/schemas';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
<<<<<<< HEAD
<<<<<<< HEAD
=======
    findAll(): Promise<User[]>;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
    create(createUserDto: CreateUserDto): Promise<User>;
}
