import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/stratergy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'your_jwt_secret', // Use a secure secret or environment variable
      signOptions: { expiresIn: '1h' }, // Set your token expiry time
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService
  ],
})
export class AuthModule {}
