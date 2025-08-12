import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
    phoneNumber: {
      mutable: true,
      required: false,
    },
  },
});