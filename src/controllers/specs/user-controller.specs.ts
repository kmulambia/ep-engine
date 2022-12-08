export type forgotPasword = {
  email: string;
};


export const ForgotPasswordSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string' }
  },
};


export const ForgotPasswordRequestBody = {
  responses: {
    description: 'email to begin password recovery function',
      required: true,
        content: {
      'application/json': { schema: ForgotPasswordSchema },
    },
  }
};


export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    username : { type: 'string' },
  },
};

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};


export const CredentialsRequestBody = {
  responses: {
    description: 'The input of login function',
      required: true,
        content: {
      'application/json': { schema: CredentialsSchema },
    },
  }
};