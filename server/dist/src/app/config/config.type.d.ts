<<<<<<< HEAD
import { DatabaseConfig } from 'src/core/database/config';
import { AppConfig } from './app-config.type';
export type AllConfigType = {
    app: AppConfig;
    database: DatabaseConfig;
=======
import { DatabaseConfig } from "src/core/database/config";
import { AppConfig } from "./app-config.type";
import { GoogleConfig } from "../modules/auth-google/config/google-config.type";
import { FacebookConfig } from "../modules/auth-facebook/config/facebook-config.type";
import { AppleConfig } from "../modules/auth-apple/config/apple-config.type";
export type AllConfigType = {
    app: AppConfig;
    database: DatabaseConfig;
    google: GoogleConfig;
    facebook: FacebookConfig;
    apple: AppleConfig;
>>>>>>> a768db95c667773a296a2e5a7ac9eee2a815d013
};
