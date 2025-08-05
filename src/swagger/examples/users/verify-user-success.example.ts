import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { VERIFY_USER_STATUS } from 'src/user/constant/verify-email.constant';
import { VerifyUserResponseDto } from 'src/user/dto/responses/verify-email.dto';

export const VerifyUserSuccessExample = createSuccessResponseDto(
  VerifyUserResponseDto,
  {
    exampleMessage: 'Verify user successfully',
    examplePayload: {
      verifyStatus: VERIFY_USER_STATUS.SUCCESS,
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
