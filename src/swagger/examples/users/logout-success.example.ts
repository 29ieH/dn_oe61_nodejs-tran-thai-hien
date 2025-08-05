import { createSuccessResponseDto } from 'src/common/helpers/swagger.helper';
export class EmptyResponseDto {}
export const LogoutSuccessExample = createSuccessResponseDto(EmptyResponseDto, {
  exampleMessage: 'Logout successfully',
  examplePayload: null,
});
