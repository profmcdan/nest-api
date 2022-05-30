import { DbService } from './../db/db.service';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from "@nestjs/common";
import {User, Bookmark} from '@prisma/client'
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

        delete user.hash

        return {
            access_token: this.signToken(user)
        }
    }

    signToken(user: User){
        const payload = {
            sub: user.id,
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: ['ADMIN', 'LECTURER']
        }

        return this.jwt.sign(payload, {
            expiresIn: '5d',
            secret: this.config.get('JWT_SECRET')
        })
    }
}