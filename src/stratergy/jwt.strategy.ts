import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';
import config from 'src/config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, // ✅ Inject ConfigService
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // ✅ Load from env
    });
  }

  async validate(payload: AuthJwtPayload) {
    // Validate the user by the JWT payload
    const user = await this.authService.findById(payload.sub); 
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; 
  }
}
