import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { AuthJwtPayload } from 'src/auth/types/auth-jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService, // To verify the user
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // Use a secure key or environment variable
    });
  }

  async validate(payload: AuthJwtPayload) {
    // Validate the user by the JWT payload
    const user = await this.authService.findById(payload.sub); // Implement this method
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // This will attach the user to the request object
  }
}
