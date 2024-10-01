import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  generateRandomNumber(length: number = 6): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
