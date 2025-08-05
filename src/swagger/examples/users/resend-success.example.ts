import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { SEND_MAIL_STATUS } from 'src/user/constant/email.constant';
import { ResendVerifyEmailResponseDto } from 'src/user/dto/responses/resend-verify-email.dto';

export const ResendSuccessExample = createSuccessResponseDto(
  ResendVerifyEmailResponseDto,
  {
    exampleMessage: 'Resend verification email successfully',
    examplePayload: {
      sendMailStatus: SEND_MAIL_STATUS.FAILED,
      expiresAt: '2025-08-08T10:00:00.000Z',
    },
  },
);
