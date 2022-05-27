import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("api/v1/auth")
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('register')
    signup(){
        return this.authService.signup();
    }

    @Post('login')
    login(){
        return this.authService.login();
    }
}