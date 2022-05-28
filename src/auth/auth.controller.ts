import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthDto, CreateUserDto } from "./dto";

@Controller("api/v1/auth")
@ApiTags("auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    @ApiBody({type: CreateUserDto})
    signup(@Body() data: CreateUserDto){
        return this.authService.signup(data);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody({type: AuthDto})
    login(@Body() data: AuthDto){
        return this.authService.login(data);
    }
}