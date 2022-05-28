import { GetUser } from './../auth/decorator';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@Controller('api/v1/users')
export class UserController {

    @UseGuards(JwtGuard)
    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }
}
