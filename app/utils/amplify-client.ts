import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import type { Schema } from '../../amplify/data/resource';
import outputs from '../../amplify_outputs.json';

// Ensure Amplify is configured before creating the client
if (typeof window !== 'undefined') {
  Amplify.configure(outputs);
}

export const client = generateClient<Schema>();

// Type definitions from your schema
export type Reservation = Schema['Reservation']['type'];
export type Order = Schema['Order']['type'];
export type MenuItem = Schema['MenuItem']['type'];
export type User = Schema['User']['type'];

// Status enums
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';