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
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['create', 'read']),
      allow.owner().to(['read', 'update', 'delete']),
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
      allow.groups(['admin']).to(['create', 'read', 'update', 'delete']),
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