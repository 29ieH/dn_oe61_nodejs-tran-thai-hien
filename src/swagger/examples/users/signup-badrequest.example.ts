export const SignupBadRequestExample = {
  statusCode: 400,
  message: 'Invalid Input',
  details: [
    { field: 'email', message: ['Email must be not empty', 'Invalid format'] },
    { field: 'username', message: ['Username must be not empty'] },
    {
      field: 'password',
      message: [
        'Password must be not empty',
        'Password must be at least 6 characters',
      ],
    },
  ],
};
