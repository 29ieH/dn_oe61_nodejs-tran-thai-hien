import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Render,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { AccessTokenPayload } from 'src/auth/interfaces/access-token-payload';
import { QueryParamDto } from 'src/common/constants/query-param.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IsPublicRoute } from 'src/common/decorators/public-route.decorator';
import { MessageResource } from 'src/common/decorators/resource.decorator';
import { extractTokenFromHeader } from 'src/common/utils/jwt.util';
import { UnauthorizedExample } from 'src/swagger/examples/unauthorized.example';
import { EmailNotFoundExample } from 'src/swagger/examples/users/email-notfound.example';
import { ForgotPasswordSuccessExample } from 'src/swagger/examples/users/forgot-pasword-success.example';
import { GetProfileSuccessExample } from 'src/swagger/examples/users/get-profile-success.example';
import { LoginForbiddenExample } from 'src/swagger/examples/users/login-forbidden.example';
import { LoginSuccessExample } from 'src/swagger/examples/users/login-success.example';
import { LoginUnauthorizedExample } from 'src/swagger/examples/users/login-unauthorized.example';
import { LogoutConflictExample } from 'src/swagger/examples/users/logout-conflict.examp;e';
import { LogoutSuccessExample } from 'src/swagger/examples/users/logout-success.example';
import { ResendSuccessExample } from 'src/swagger/examples/users/resend-success.example';
import { SignupBadRequestExample } from 'src/swagger/examples/users/signup-badrequest.example';
import { SignupConflictExample } from 'src/swagger/examples/users/signup-conflict.example';
import { UpdateProfileConflictExample } from 'src/swagger/examples/users/update-profile-conflict.example';
import { UpdateProfileSuccessExample } from 'src/swagger/examples/users/update-profile-success.example';
import { ResendVerifyBadRequestExample } from 'src/swagger/examples/users/user-notfound.exampe';
import { VerifyEmailTokenNotFound } from 'src/swagger/examples/users/verify-email-token-notfound.example';
import { VerifyUserSuccessExample } from 'src/swagger/examples/users/verify-user-success.example';
import { LoginDto } from './dto/requests/login.dto';
import { ProfileUpdateRequestDto } from './dto/requests/profile-update.dto';
import { ResetPasswordDto } from './dto/requests/reset-password';
import { SignupDto } from './dto/requests/signup.dto';
import { SignupResponseDto } from './dto/responses/signup-response.dto';
import { UserService } from './user.service';
import { UpdateProfileFaileExample } from 'src/swagger/examples/users/update-profile-failed.example';
import { FindPublicUserSuccessExample } from 'src/swagger/examples/users/find-public-user-success.example';
import { FindUserDetailSuccessExample } from 'src/swagger/examples/users/find-detail-user-success.example';
import { FindPublicUserFailedExample } from 'src/swagger/examples/users/find-public-user-failed.example';
import { InterValServerErrorExample } from 'src/swagger/examples/internal-server-error.example';
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
    private readonly configService: ConfigService,
  ) {}
  @ApiOperation({ summary: 'Signup User' })
  @ApiResponse({
    status: 201,
    description: 'User Signup for system',
    type: SignupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    example: SignupBadRequestExample,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Duplicate user info',
    example: SignupConflictExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Post('/signup')
  @IsPublicRoute()
  @MessageResource('user', 'signup')
  async signup(@Body() dto: SignupDto) {
    return this.userService.signup(dto);
  }
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({
    status: 201,
    description: 'Successful login. Returns user information and access token.',
    type: LoginSuccessExample,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials',
    example: LoginUnauthorizedExample,
  })
  @ApiResponse({
    status: 403,
    description: 'Email not verified',
    example: LoginForbiddenExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Post('/login')
  @IsPublicRoute()
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const result = await this.userService.login(dto);
    res.cookie('accessToken', result.data?.accessToken, {
      httpOnly: true,
      maxAge:
        this.configService.get<number>('cookie.accessTokenTTL', 3600) * 1000,
      sameSite: 'strict',
    });
    return res.send({
      success: true,
      data: {
        ...result.data,
      },
    });
  }
  @ApiExcludeEndpoint()
  @IsPublicRoute()
  @Get('/login')
  @Render('pages/login')
  getLoginForm() {}
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({
    status: 201,
    description: 'Logout successfully',
    type: LogoutSuccessExample,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Missing or invalid credentials',
    example: UnauthorizedExample,
  })
  @ApiResponse({
    status: 409,
    description: 'User already logged out',
    example: LogoutConflictExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @ApiBearerAuth('access-token')
  @Post('/logout')
  async logout(@Req() req: Request) {
    const token = extractTokenFromHeader(req);
    if (!token)
      throw new UnauthorizedException(
        this.i18nService.translate('common.request.errors.token_invalid'),
      );
    return this.userService.logout(token);
  }
  @MessageResource('user', 'sendVerifyEmail')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    description: 'User email address to resend verification link',
    example: 'user@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Resend verify email successfully',
    type: ResendSuccessExample,
  })
  @ApiResponse({
    status: 404,
    description: 'Email is invalid or already verified',
    example: ResendVerifyBadRequestExample,
  })
  @ApiResponse({
    status: 400,
    description: 'Email not found',
    example: EmailNotFoundExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Get('/resend-verify-email')
  @IsPublicRoute()
  async resendVerifyEmail(@Query('email') email: string) {
    if (!email)
      throw new NotFoundException(
        this.i18nService.translate('common.request.errors.emailNotfound'),
      );
    return this.userService.resendVerifyEmail(email);
  }
  @ApiOperation({ summary: 'Verify user email' })
  @ApiQuery({
    name: 'token',
    required: true,
    type: String,
    description: "Token used to verify the user's email address",
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyUserSuccessExample,
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
    example: VerifyEmailTokenNotFound,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Get('/verify-email')
  @IsPublicRoute()
  async verifyEmail(@Query('token') token: string) {
    if (!token)
      throw new NotFoundException(
        this.i18nService.translate('common.request.errors.tokenNotFound'),
      );
    return this.userService.verifyEmail(token);
  }
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    description: 'Email used to reset password',
    example: 'examplel@gmail.com',
  })
  @ApiResponse({
    status: 200,
    description: 'Send token reset password successfully',
    type: ForgotPasswordSuccessExample,
  })
  @ApiResponse({
    status: 404,
    description: 'Email to forgot password not found',
    example: EmailNotFoundExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Get('/forgot-password')
  @IsPublicRoute()
  async forgotPassword(@Query('email') email: string) {
    if (!email)
      throw new NotFoundException(
        this.i18nService.translate('common.request.errors.emailNotFound'),
      );
    return this.userService.forgotPassword(email);
  }
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 201,
    description: 'Reset password successfully',
    type: VerifyUserSuccessExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @Post('/reset-password')
  @IsPublicRoute()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }
  @ApiOperation({ summary: 'Profile User' })
  @ApiResponse({
    status: 200,
    description: 'Get my profile successfully',
    type: GetProfileSuccessExample,
  })
  @ApiBearerAuth('access-token')
  @Get('/profile')
  async myProfile(@CurrentUser() user: AccessTokenPayload) {
    return this.userService.myProfile(user);
  }
  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({
    status: 201,
    description: 'Update my profile successfully',
    type: UpdateProfileSuccessExample,
  })
  @ApiResponse({
    status: 400,
    description: 'Duplicate value',
    example: UpdateProfileConflictExample,
  })
  @ApiResponse({
    status: 409,
    description: 'Update my profile failed',
    example: UpdateProfileFaileExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @ApiBearerAuth('access-token')
  @Patch('/profile')
  async updateProfile(
    @CurrentUser() user: AccessTokenPayload,
    @Body() dto: ProfileUpdateRequestDto,
  ) {
    return this.userService.updateMyProfile(user, dto);
  }
  @ApiOperation({ summary: 'Find public users' })
  @ApiResponse({
    status: 200,
    description: 'Find public users successfully',
    type: FindPublicUserSuccessExample,
  })
  @ApiResponse({
    status: 409,
    description: 'Find public users failed',
    example: FindPublicUserFailedExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @ApiBearerAuth('access-token')
  @Get('')
  async findPublicUsers(@Query() query: QueryParamDto) {
    return this.userService.findPublicUsers(query);
  }
  @ApiOperation({ summary: 'Find detail users' })
  @ApiResponse({
    status: 200,
    description: 'Find user detail successfully',
    type: FindUserDetailSuccessExample,
  })
  @ApiResponse({
    status: 409,
    description: 'Find user detail failed',
    example: FindPublicUserFailedExample,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    example: InterValServerErrorExample,
  })
  @ApiBearerAuth('access-token')
  @Get(':userId')
  async findDetail(
    @CurrentUser() user: AccessTokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.findUserDetail(user, userId);
  }
}
