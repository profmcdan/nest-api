import { DbService } from './../../db/db.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService, private db: DbService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")
        })
    }

    async validate(payload: {sub: number, email: string}){
        const user = await this.db.user.findFirst({
            where: {
                id: payload.sub
            }
        })
        delete user.hash
        return user;
    }
}