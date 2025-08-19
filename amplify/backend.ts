import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
// Lambda functions temporarily disabled for deployment
// import { reservationReminder } from './functions/reservation-reminder/resource.js';
// import { orderValidation } from './functions/order-validation/resource.js';
// import { Duration } from 'aws-cdk-lib';
// import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
// import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export const backend = defineBackend({
  auth,
  data,
  // reservationReminder,
  // orderValidation,
});

// Lambda functions temporarily disabled for deployment
/*
// Grant permissions to Lambda functions
backend.reservationReminder.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'dynamodb:Scan',
      'dynamodb:Query',
      'dynamodb:GetItem'
    ],
    resources: ['*'] // In production, specify exact table ARNs
  })
);

backend.reservationReminder.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'ses:SendEmail',
      'ses:SendRawEmail'
    ],
    resources: ['*']
  })
);

backend.reservationReminder.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'sns:Publish'
    ],
    resources: ['*']
  })
);

backend.orderValidation.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'dynamodb:Query',
      'dynamodb:GetItem'
    ],
    resources: ['*'] // In production, specify exact table ARNs
  })
);

// Create CloudWatch scheduled event for reservation reminders
const reminderStack = backend.createStack('reservation-reminder-schedule');

const reminderRule = new Rule(reminderStack, 'ReservationReminderRule', {
  schedule: Schedule.rate(Duration.hours(1)), // Run every hour
  description: 'Trigger reservation reminder Lambda every hour',
});

reminderRule.addTarget(new LambdaFunction(backend.reservationReminder.resources.lambda));

// Export the Lambda function ARNs for reference
backend.addOutput({
  custom: {
    reservationReminderArn: backend.reservationReminder.resources.lambda.functionArn,
    orderValidationArn: backend.orderValidation.resources.lambda.functionArn,
  }
});
*/