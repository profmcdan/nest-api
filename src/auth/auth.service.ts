import { ConfigService } from '@nestjs/config';
import { IsEmail } from 'class-validator';
import { ForbiddenException, Injectable } from "@nestjs/common";
import {User, Bookmark} from '@prisma/client'
import { DbService } from "src/db/db.service";
import { AuthDto, CreateUserDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private db: DbService, private jwt: JwtService, private config: ConfigService){}
    
    async signup(data: CreateUserDto){
        const hash = await argon.hash(data.password);
        try{
            const user = await this.db.user.create({
                data: {
                    email: data.email.toLowerCase(),
                    firstName: data.firstName,
                    lastName: data.lastName,
                    hash
                }
            });
            delete user.hash;
            return user;
        }
        catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException('Credential Taken')
                }
            }
            throw error;
        }
    }

    async login(data: AuthDto){
        const user = await this.db.user.findFirst({
            where: {
                email: data.email
            }
        });
        if(!user){
            throw new ForbiddenException('Credentials incorrect');
        }

        const pwMatches = await argon.verify(user.hash, data.password);
        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect');
        }

        return {
            access_token: this.signToken(user.id, user.email)
        }
    }

    async signToken(userId: number, email: string): Promise<string>{
        const payload = {
            sub: userId,
            email,
        }

        return this.jwt.signAsync(payload, {
            expiresIn: '5d',
            secret: this.config.get('JWT_SECRET')
        })
    }
}