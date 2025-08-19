import { defineFunction } from '@aws-amplify/backend';

export const orderValidation = defineFunction({
  name: 'order-validation',
  entry: './handler.ts',
  timeoutSeconds: 30,
  environment: {
    MAX_ORDERS_PER_HOUR: '5',
    MAX_ORDER_AMOUNT: '500',
    MIN_ORDER_AMOUNT: '15',
    DELIVERY_RADIUS_MILES: '5'
  }
});