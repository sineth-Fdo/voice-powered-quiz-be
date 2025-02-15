import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/enums/user.enum';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { LoginDto } from './dto/login-auth.dto';
import { SignupDto } from './dto/signup-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   // POST Signup (/auth/signup)
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles(Role.ADMIN)
   @Post('signup')
   async signup(@Body() signupData: SignupDto) {
     return this.authService.signup(signupData);
    }
    
    // POST Login (/auth/login)
    @Post('login')
    async login(@Body() loginData: LoginDto) {
      return this.authService.login(loginData);
    }
    
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER, Role.ADMIN)
  @Post('test')
  async test() {
    return 'This is a test route';
  }


}
