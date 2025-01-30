import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, 
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
