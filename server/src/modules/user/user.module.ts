import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TokenUtil } from 'src/utils/createToken';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, TokenUtil],
  controllers: [UserController],
})
export class UserModule {}
