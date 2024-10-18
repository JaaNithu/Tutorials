import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenUtil {
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    });
  }

  async generateToken({ id, email, role }) {
    const token = this.jwtService.sign({ id, email, role });
    return token;
  }
}
