import { defineFunction } from '@aws-amplify/backend';

export const reservationReminder = defineFunction({
  name: 'reservation-reminder',
  entry: './handler.ts',
  timeoutSeconds: 60,
  environment: {
    RESTAURANT_NAME: 'Golden Dragon Restaurant',
    RESTAURANT_PHONE: '(555) 123-4567',
    REMINDER_HOURS_BEFORE: '2'
  }
});