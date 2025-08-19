import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

export const backend = defineBackend({
  auth,
  data,
});

// Lambda functions temporarily disabled for deployment
// Will be re-enabled after fixing deployment issues