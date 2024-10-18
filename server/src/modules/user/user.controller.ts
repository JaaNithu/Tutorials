import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginUserDto } from "../dto/loginUser.dto";
import { Request, Response } from 'express';
import { CreateUserDto } from "../dto/createUser.dto";
import { UpdateUserDto } from "../dto/updateUser.dto";

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.userService.login(loginUserDto, res);
  }

  @Post('/register')
  async register(@Body() createCreateDto: CreateUserDto, @Res() res: Response) {
    return this.userService.doUserRegistration(createCreateDto, res);
  }

  @Post('/login-admin')
  async loginAdmin(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.userService.loginAdmin(createUserDto, res);
  }

  @Get('/all-users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number){
    return await this.userService.getUserById(id);
  }
  
  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response
  ) {
    return await this.userService.updateUser(id, updateUserDto, res);
  }

  @Delete('delete/:id')
    async deleteUser(@Param('id') id: number, @Res() res: Response) {
        return this.userService.deleteUser(id, res);
    }
}
