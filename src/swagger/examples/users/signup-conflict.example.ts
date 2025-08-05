export const SignupConflictExample = {
  statusCode: 409,
  message: 'Invalid Input',
  details: [
    { field: 'email', message: 'Email already exists' },
    { field: 'username', message: 'Username already exists' },
    { field: 'phone', message: 'Phone number already exists' },
  ],
};
