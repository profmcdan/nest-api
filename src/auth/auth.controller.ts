import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, CreateUserDto } from "./dto";

@Controller("api/v1/auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    signup(@Body() data: CreateUserDto){
        return this.authService.signup(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() data: AuthDto){
        return this.authService.login(data);
    }
}