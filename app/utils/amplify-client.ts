import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

export const client = generateClient<Schema>();

// Type definitions from your schema
export type Reservation = Schema['Reservation']['type'];
export type Order = Schema['Order']['type'];
export type MenuItem = Schema['MenuItem']['type'];
export type User = Schema['User']['type'];

// Status enums
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';