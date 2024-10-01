import { AuthService } from './auth.service';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<void>;
<<<<<<< HEAD
=======
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
=======
>>>>>>> 744d629 (Revert "Refactor enum and schema imports")
}
