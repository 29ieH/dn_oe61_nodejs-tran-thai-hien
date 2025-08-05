import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { UserSummaryDto } from 'src/user/dto/responses/user-summary.dto';
export const FindPublicUserSuccessExample = createSuccessResponseDto(
  UserSummaryDto,
  {
    isArray: true,
    exampleMessage: 'Find public users successfully',
    examplePayload: [
      {
        id: 1,
        name: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        isVerified: true,
        status: 'ACTIVE',
      },
      {
        id: 2,
        name: 'John Wick',
        userName: 'johnwick',
        email: 'johnwick@example.com',
        isVerified: true,
        status: 'ACTIVE',
      },
    ],
  },
);
