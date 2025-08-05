import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { UserSummaryDto } from 'src/user/dto/responses/user-summary.dto';

export const FindUserDetailSuccessExample = createSuccessResponseDto(
  UserSummaryDto,
  {
    exampleMessage: 'Find user detail failed',
    examplePayload: {
      id: 1,
      name: 'John Doe',
      userName: 'johndoe',
      email: 'john@example.com',
      isVerified: true,
      status: 'ACTIVE',
    },
  },
);
