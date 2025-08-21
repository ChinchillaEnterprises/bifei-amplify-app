import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

// Temporarily simplified backend for deployment troubleshooting
export const backend = defineBackend({
  auth,
  data,
});