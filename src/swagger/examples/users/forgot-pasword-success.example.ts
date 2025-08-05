import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { SEND_MAIL_STATUS } from 'src/user/constant/email.constant';
import { ForgotPasswordResponse } from 'src/user/dto/responses/forgot-password-response';

export const ForgotPasswordSuccessExample = createSuccessResponseDto(
  ForgotPasswordResponse,
  {
    exampleMessage: 'Forgot password successfully',
    examplePayload: {
      sendMailStatus: SEND_MAIL_STATUS.SENT,
      user: {
        id: 1,
        name: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        isVerified: true,
        status: 'ACTIVE',
      },
    },
  },
);
