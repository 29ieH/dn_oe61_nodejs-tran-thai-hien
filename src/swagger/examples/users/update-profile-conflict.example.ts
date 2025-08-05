export const UpdateProfileConflictExample = {
  statusCode: 409,
  message: 'Invalid Input',
  details: [{ field: 'phone', message: 'Phone number already exists' }],
};
