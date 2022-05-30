import { EditUserDto } from './dto';
import { JwtGuard } from './../auth/guard';
import { GetUser } from './../auth/decorator';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('api/v1/users')
@ApiBearerAuth("Bearer")
export class UserController {
    constructor(private userService: UserService){}

    @UseGuards(JwtGuard)
    @Get("me")
    getMe(@GetUser() user: User){
        return user;
    }

    @UseGuards(JwtGuard)
    @Patch()
    editUser(@GetUser("id") userId: number, @Body() dto: EditUserDto){
        return this.userService.editUser(userId, dto);
    }
}
