import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { LoginResponseDto } from 'src/user/dto/responses/login-response.dto';

export const LoginSuccessExample = createSuccessResponseDto(LoginResponseDto, {
  exampleMessage: 'Login successfully',
  examplePayload: {
    id: 1,
    name: 'John Doe',
    userName: 'johndoe',
    email: 'john@example.com',
    role: 'admin',
    isVerified: true,
    status: 'ACTIVE',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
});
