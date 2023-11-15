import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  async signUp(@Body() dto: AuthDto) {
    const user = await this.authService.signUp(dto);
    return {
      data: user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign_in')
  async signIn(@Body() dto: AuthDto) {
    const user = await this.authService.signIn(dto);

    return {
      data: user,
    };
  }
}
