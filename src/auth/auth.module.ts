import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/stratergy/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from './entities/user.entity';

@Module({
  imports: [
    PassportModule,
    ConfigModule, // ✅ Import ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        console.log('Loaded JWT_SECRET:', secret); // Debugging line
        return {
          secret: secret,
          signOptions: { expiresIn: '1h' },
        };
      },
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
  exports: [AuthService]
})
export class AuthModule {}
