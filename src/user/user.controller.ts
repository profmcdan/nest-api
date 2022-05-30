import { JwtGuard } from './../auth/guard/jwt.guard';
import { GetUser } from './../auth/decorator';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UserController {

    @UseGuards(JwtGuard)
    @ApiBearerAuth("Bearer")
    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }
}
