import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { ModelsModule } from 'src/schemas/models/models.module';

@Module({
  imports: [AuthModule, ModelsModule],
  controllers: [GalleryController],
  providers: [GalleryService, JwtStrategy],
})
export class GalleryModule {}
