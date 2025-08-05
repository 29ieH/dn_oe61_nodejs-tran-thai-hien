import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
import { UserProfileResponse } from 'src/user/dto/responses/user-profile.response';

export const UpdateProfileSuccessExample = createSuccessResponseDto(
  UserProfileResponse,
  {
    exampleMessage: 'Profile updated successfully',
    examplePayload: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Developer',
      address: 'Da Nang Street',
      phone: '0769609112',
    },
  },
);
