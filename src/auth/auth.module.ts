import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';

@Module({
    imports: [DbModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
