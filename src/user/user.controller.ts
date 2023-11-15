import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  /**
   * @description Get Users Profile
   */
  @Get('me')
  @UseGuards(JwtGuard)
  getUserProfile(@Req() req: Request) {
    return {
      message: 'Get Users Profile',
      data: {
        user: req.user,
      },
    };
  }
}
