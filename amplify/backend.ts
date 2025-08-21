import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

// Temporarily simplified backend - using yarn for better network handling
export const backend = defineBackend({
  auth,
  data,
});