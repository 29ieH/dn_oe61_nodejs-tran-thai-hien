import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { UserProfileResponse } from 'src/user/dto/responses/user-profile.response';

export const GetProfileSuccessExample = createSuccessResponseDto(
  UserProfileResponse,
  {
    exampleMessage: 'Get profile successfully',
    examplePayload: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0797709412',
      address: 'Da Nang Street',
    },
  },
);
