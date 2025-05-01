import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login-auth.dto';
import { SignupDto } from './dto/signup-auth.dto';
import { User } from './entities/user.entity';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private UserModel: Model<User>,
  private jwtService: JwtService
) {}

      // register a new user
      async signup(signupData: SignupDto) {

        const {email, name, password, role, grade, batch} = signupData;

        const emailInUse = await this.UserModel.findOne({email});

        if(emailInUse) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.UserModel.create({
            email,
            name,
            password: hashedPassword,
            role,
            grade,
            batch
        });

        return 'User registered successfully';


    }

    
    // login a user
    async login(loginData: LoginDto) {
      try {
        const {email, password} = loginData;

        const user = await this.UserModel.findOne({email});
  
        if(!user) {
            throw new BadRequestException('Invalid credentials');
        }
  
        if (user.status === 'inactive') {
          throw new BadRequestException('Your account has been deactivated');
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if(!isPasswordValid) {
            throw new BadRequestException('Invalid credentials');
        }
  
        // Genarate JWT token 
        return  this.generateTokens(user.id, user.role);

      }catch (error) {
        throw new BadRequestException(`Error: ${error.message}`);
      }
     
  }


  async generateTokens(userId: string , role: string) {
    const payload: AuthJwtPayload = { uid: userId, role };
    const accessToken = await this.jwtService.signAsync(payload); // Signs the JWT token
  
    return {
      accessToken,
    };
  }

    async findById(id: string) {
        return this.UserModel.findById(id);
    }
  


}
