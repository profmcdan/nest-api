import { DbService } from './../db/db.service';
import { EditUserDto } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private db: DbService){}
    
    async editUser(userId: number, dto: EditUserDto){
        const user = await this.db.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        });

        delete user.hash;
        return user;
    }
}
