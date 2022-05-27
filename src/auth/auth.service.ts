import { Injectable } from "@nestjs/common";
import {User, Bookmark} from '@prisma/client'
import { DbService } from "src/db/db.service";

@Injectable({})
export class AuthService {
    constructor(private db: DbService){}
    
    login(){
        return {
            msg: 'I am signed in'
        };
    }

    signup(){
        return {
            msg: 'I am signed up'
        };
    }
}