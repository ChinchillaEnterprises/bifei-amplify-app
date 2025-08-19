import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Reservation: a
    .model({
      id: a.id(),
      customerName: a.string().required(),
      email: a.email().required(),
      phone: a.phone(),
      date: a.date().required(),
      time: a.string().required(),
      numberOfGuests: a.integer().required(),
      specialRequests: a.string(),
      status: a.enum(['pending', 'confirmed', 'cancelled']),
      userId: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['create', 'read']), // Allow public users to create and read reservations
      allow.groups(['customer']).to(['create', 'read']),
      allow.groups(['restaurantHost']).to(['create', 'read', 'update']),
      allow.groups(['maintenance']).to(['create', 'read', 'update', 'delete']),
      allow.owner().to(['read', 'update']),
    ]),
  
  Order: a
    .model({
      id: a.id(),
      customerName: a.string().required(),
      email: a.email().required(),
      phone: a.phone().required(),
      deliveryAddress: a.string().required(),
      items: a.json().required(),
      subtotal: a.float().required(),
      tax: a.float().required(),
      deliveryFee: a.float().required(),
      total: a.float().required(),
      status: a.enum(['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled']),
      specialInstructions: a.string(),
      userId: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['create', 'read']), // Allow public users to create and read orders
      allow.groups(['customer']).to(['create', 'read']),
      allow.groups(['restaurantHost']).to(['read', 'update']),
      allow.groups(['maintenance']).to(['create', 'read', 'update', 'delete']),
      allow.owner().to(['read']),
    ]),
  
  MenuItem: a
    .model({
      id: a.id(),
      name: a.string().required(),
      nameZh: a.string().required(), // Chinese name
      description: a.string(),
      descriptionZh: a.string(), // Chinese description
      category: a.enum(['appetizers', 'soups', 'poultry', 'beef', 'pork', 'seafood', 'vegetarian', 'rice', 'noodles', 'desserts', 'beverages']),
      price: a.float().required(),
      imageUrl: a.url(),
      spicyLevel: a.integer().default(0), // 0-5 scale
      isVegetarian: a.boolean().default(false),
      isGlutenFree: a.boolean().default(false),
      isAvailable: a.boolean().default(true),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read']),
      allow.groups(['restaurantHost']).to(['read', 'update']),
      allow.groups(['maintenance']).to(['create', 'read', 'update', 'delete']),
    ]),
  
  User: a
    .model({
      id: a.id(),
      email: a.email().required(),
      name: a.string(),
      phoneNumber: a.phone(),
      role: a.enum(['customer', 'restaurantHost', 'maintenance']),
      memberSince: a.datetime(),
      totalOrders: a.integer().default(0),
      totalSpent: a.float().default(0),
      loyaltyPoints: a.integer().default(0),
    })
    .authorization(allow => [
      allow.groups(['customer']).to(['read']),
      allow.groups(['restaurantHost']).to(['read', 'update']),
      allow.groups(['maintenance']).to(['create', 'read', 'update', 'delete']),
      allow.owner().to(['read', 'update']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});