import {
    Body,
    Controller,
    Post,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
    };
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Route permettant à un nouvel utilisateur
    // d'envoyer ses informations et de créer son compte.
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    // Route permettant à un utilisateur existant
    // de se connecter avec ses identifiants.
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // Route protégée permettant à un utilisateur
    // possédant un JWT valide de consulter son profil.
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() request: AuthenticatedRequest) {
        return request.user;
    }
}