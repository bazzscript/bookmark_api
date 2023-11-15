import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async signUp(dto: AuthDto) {
    try {
      // Generate the password Hash
      const passwordShash = bcrypt.hashSync(dto.password, 10);

      // Save New User
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: passwordShash,
        },

        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const data = await this.signToken({ email: user.email, userId: user.id });
      return data;
    } catch (error) {
      throw new BadRequestException(
        'email is not available, try another email',
      );
    }
  }
  async signIn(dto: AuthDto) {
    try {
      // FInd User BY Email
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) {
        throw new BadRequestException('Invalid Credentials');
      }
      // Compare Password
      const isCorrectPassword = await bcrypt.compare(
        dto.password,
        user.password,
      );

      // If Not Correct Password
      if (!isCorrectPassword) {
        throw new BadRequestException('Invalid Credentials');
      }

      const data = await this.signToken({ email: user.email, userId: user.id });
      return data;
    } catch (error) {
      throw new BadRequestException('Invalid Credentials');
    }
  }

  // Generate JWT Tokens After Sign Up or Sign In
  async signToken(args: { userId: number; email: string }): Promise<object> {
    const payload = {
      userId: args.userId,
      email: args.email,
    };

    const secret = this.config.getOrThrow('jwtSecretToken');
    const result = await this.jwt.signAsync(payload, {
      expiresIn: '365d',
      secret,
    });

    return {
      accessToken: result,
    };
  }
}
