import { Injectable, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { LoginUserDto } from "../dto/loginUser.dto";
import { TokenUtil } from '../../utils/createToken';
import { Response } from 'express';
import { CreateUserDto } from "../dto/createUser.dto";
import { UpdateUserDto } from "../dto/updateUser.dto";
import { Section } from "../section/section.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenUtil: TokenUtil,
  ) {}

  async doUserRegistration(createUserDto: CreateUserDto, res: Response) {
    const { name, email, password, role } = createUserDto;

    if (!name || !email || !password || !role) {
      throw new BadRequestException(
        'Name, email, password, and role are required',
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const newUser = this.userRepository.create({
      name,
      email,
      password,
      role,
    });
    await this.userRepository.save(newUser);

    const token = await this.tokenUtil.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie('token', token, { httpOnly: true });

    return res.status(201).json({
      message: 'User registered successfully',
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;

    console.log(loginUserDto);
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found, please register first');
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      throw new BadRequestException('Credentials do not match');
    }

    const token = await this.tokenUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
      sameSite: 'none', // Allow cross-origin cookies
      domain: 'localhost',
    });

    return res.status(200).json({
      name: user.name,
      role: user.role,
      email: user.email,
      token,
    });
  }


  async register(createUserDto: CreateUserDto, res: Response) {
    const { name, email, password, role } = createUserDto;

    if (!name || !email || !password || !role) {
      throw new BadRequestException(
        'Name, email, password, and role are required',
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const newUser = this.userRepository.create({
      name,
      email,
      password,
      role,
    });
    await this.userRepository.save(newUser);

    const token = await this.tokenUtil.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    res.cookie('token', token, { httpOnly: true });

    return res.status(201).json({
      message: 'User registered successfully',
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token,
    });
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async loginAdmin(createUserDto: CreateUserDto, res: Response) {
    const { email, password } = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found, please register first');
    }

    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      throw new BadRequestException('Credentials do not match');
    }

    const token = await this.tokenUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
      message: 'Logged in successfully as admin',
      name: user.name,
      email: user.email,
      token,
    });
  }
  
  async updateUser(id: number, updateUserDto: UpdateUserDto, res: Response) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields if provided in DTO
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  }

  async deleteUser(id: number, res: Response) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
        throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);

    return res.status(200).json({
        message: 'User deleted successfully',
    });
}

}
