import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface ValidationEvent {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  orderTotal: number;
  items: any[];
  userId?: string;
}

interface ValidationResponse {
  isValid: boolean;
  requiresConfirmation: boolean;
  issues: string[];
  riskScore: number;
  suggestedAddress?: string;
  recommendations?: string[];
}

// Blacklisted patterns (in production, store in DynamoDB)
const BLACKLISTED_PATTERNS = {
  phones: [
    '555-555-5555',
    '123-456-7890',
    '000-000-0000'
  ],
  addresses: [
    'test address',
    'fake street',
    '123 test'
  ],
  emails: [
    'test@test.com',
    'fake@fake.com'
  ]
};

// Suspicious patterns
const SUSPICIOUS_KEYWORDS = ['urgent', 'asap', 'test', 'fake', 'xxx'];

export const handler = async (event: ValidationEvent): Promise<ValidationResponse> => {
  console.log('Validating order:', JSON.stringify(event, null, 2));
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;
  
  const {
    customerName,
    email,
    phone,
    deliveryAddress,
    orderTotal,
    items,
    userId
  } = event;
  
  // 1. Validate Phone Number
  const phoneValidation = validatePhoneNumber(phone);
  if (!phoneValidation.isValid) {
    issues.push(phoneValidation.issue);
    riskScore += 30;
  }
  
  // 2. Validate Email
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    issues.push(emailValidation.issue);
    riskScore += 20;
  }
  
  // 3. Validate Address
  const addressValidation = validateAddress(deliveryAddress);
  if (!addressValidation.isValid) {
    issues.push(addressValidation.issue);
    riskScore += 25;
  }
  
  // 4. Check Order Amount
  const maxAmount = parseFloat(process.env.MAX_ORDER_AMOUNT || '500');
  const minAmount = parseFloat(process.env.MIN_ORDER_AMOUNT || '15');
  
  if (orderTotal > maxAmount) {
    issues.push(`Order amount ($${orderTotal}) exceeds maximum ($${maxAmount})`);
    riskScore += 40;
    recommendations.push('Consider calling customer to confirm large order');
  }
  
  if (orderTotal < minAmount) {
    issues.push(`Order amount ($${orderTotal}) below minimum ($${minAmount})`);
    riskScore += 50;
  }
  
  // 5. Check Order Frequency (if user is logged in)
  if (userId) {
    const frequencyCheck = await checkOrderFrequency(userId);
    if (frequencyCheck.tooFrequent) {
      issues.push(frequencyCheck.issue);
      riskScore += 35;
      recommendations.push('Possible bot or fraudulent activity detected');
    }
  }
  
  // 6. Check for Blacklisted Info
  if (isBlacklisted(phone, email, deliveryAddress)) {
    issues.push('Contact information matches blacklist patterns');
    riskScore += 60;
  }
  
  // 7. Analyze Customer Name
  if (containsSuspiciousPattern(customerName)) {
    issues.push('Customer name contains suspicious patterns');
    riskScore += 15;
  }
  
  // 8. Validate Items
  const itemValidation = validateOrderItems(items);
  if (!itemValidation.isValid) {
    issues.push(itemValidation.issue);
    riskScore += 20;
  }
  
  // 9. Check Delivery Distance
  const distanceCheck = checkDeliveryDistance(deliveryAddress);
  if (!distanceCheck.withinRange) {
    issues.push(`Delivery address outside ${process.env.DELIVERY_RADIUS_MILES} mile radius`);
    riskScore += 30;
  }
  
  // 10. Time-based Analysis
  const timeAnalysis = analyzeOrderTime();
  if (timeAnalysis.suspicious) {
    issues.push(timeAnalysis.issue);
    riskScore += 10;
  }
  
  // Calculate final validation result
  const isValid = riskScore < 50;
  const requiresConfirmation = riskScore >= 30 && riskScore < 50;
  
  // Generate recommendations based on risk score
  if (riskScore >= 70) {
    recommendations.push('HIGH RISK: Manual review strongly recommended');
    recommendations.push('Consider calling customer before preparation');
  } else if (riskScore >= 50) {
    recommendations.push('MEDIUM RISK: Send confirmation SMS/email');
    recommendations.push('Request payment upfront');
  } else if (riskScore >= 30) {
    recommendations.push('LOW RISK: Standard confirmation recommended');
  }
  
  // Clean and suggest address
  const suggestedAddress = cleanAddress(deliveryAddress);
  
  return {
    isValid,
    requiresConfirmation,
    issues,
    riskScore,
    suggestedAddress: suggestedAddress !== deliveryAddress ? suggestedAddress : undefined,
    recommendations: recommendations.length > 0 ? recommendations : undefined
  };
};

function validatePhoneNumber(phone: string): { isValid: boolean; issue: string } {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 digits)
  if (cleaned.length !== 10) {
    return { isValid: false, issue: 'Invalid phone number format' };
  }
  
  // Check for obviously fake patterns
  if (cleaned === '0000000000' || cleaned === '1234567890' || cleaned === '5555555555') {
    return { isValid: false, issue: 'Phone number appears to be fake' };
  }
  
  // Check if all digits are the same
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { isValid: false, issue: 'Phone number has repeating digits' };
  }
  
  return { isValid: true, issue: '' };
}

function validateEmail(email: string): { isValid: boolean; issue: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, issue: 'Invalid email format' };
  }
  
  // Check for disposable email domains
  const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com'];
  const domain = email.split('@')[1];
  
  if (disposableDomains.includes(domain)) {
    return { isValid: false, issue: 'Disposable email address detected' };
  }
  
  return { isValid: true, issue: '' };
}

function validateAddress(address: string): { isValid: boolean; issue: string } {
  // Check minimum length
  if (address.length < 10) {
    return { isValid: false, issue: 'Address too short' };
  }
  
  // Check for required components (basic check)
  const hasNumber = /\d/.test(address);
  const hasStreet = /\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard)\b/i.test(address);
  
  if (!hasNumber) {
    return { isValid: false, issue: 'Address missing street number' };
  }
  
  if (!hasStreet) {
    return { isValid: false, issue: 'Address missing street name' };
  }
  
  return { isValid: true, issue: '' };
}

async function checkOrderFrequency(userId: string): Promise<{ tooFrequent: boolean; issue: string }> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // Query orders from the last hour
    const params = {
      TableName: process.env.ORDER_TABLE_NAME || 'Order',
      IndexName: 'userId-createdAt-index', // Assuming this GSI exists
      KeyConditionExpression: 'userId = :userId AND createdAt > :oneHourAgo',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':oneHourAgo': oneHourAgo
      }
    };
    
    const result = await docClient.send(new QueryCommand(params));
    const recentOrders = result.Items?.length || 0;
    
    const maxOrdersPerHour = parseInt(process.env.MAX_ORDERS_PER_HOUR || '5');
    
    if (recentOrders >= maxOrdersPerHour) {
      return { 
        tooFrequent: true, 
        issue: `Too many orders (${recentOrders}) in the last hour` 
      };
    }
    
    return { tooFrequent: false, issue: '' };
  } catch (error) {
    console.error('Error checking order frequency:', error);
    return { tooFrequent: false, issue: '' };
  }
}

function isBlacklisted(phone: string, email: string, address: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  const lowerEmail = email.toLowerCase();
  const lowerAddress = address.toLowerCase();
  
  // Check phone blacklist
  if (BLACKLISTED_PATTERNS.phones.some(p => cleanPhone.includes(p.replace(/\D/g, '')))) {
    return true;
  }
  
  // Check email blacklist
  if (BLACKLISTED_PATTERNS.emails.some(e => lowerEmail.includes(e))) {
    return true;
  }
  
  // Check address blacklist
  if (BLACKLISTED_PATTERNS.addresses.some(a => lowerAddress.includes(a))) {
    return true;
  }
  
  return false;
}

function containsSuspiciousPattern(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SUSPICIOUS_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function validateOrderItems(items: any[]): { isValid: boolean; issue: string } {
  if (!items || items.length === 0) {
    return { isValid: false, issue: 'Order has no items' };
  }
  
  // Check for duplicate items with excessive quantities
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  if (totalQuantity > 50) {
    return { isValid: false, issue: `Excessive quantity ordered (${totalQuantity} items)` };
  }
  
  // Check if all items have required fields
  for (const item of items) {
    if (!item.name || !item.price || item.price <= 0) {
      return { isValid: false, issue: 'Invalid item data in order' };
    }
  }
  
  return { isValid: true, issue: '' };
}

function checkDeliveryDistance(address: string): { withinRange: boolean } {
  // In production, integrate with Google Maps API to calculate actual distance
  // For now, do a simple check based on ZIP code
  
  const zipMatch = address.match(/\b\d{5}\b/);
  if (!zipMatch) {
    return { withinRange: false };
  }
  
  const zip = zipMatch[0];
  const allowedZips = ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010'];
  
  return { withinRange: allowedZips.includes(zip) };
}

function analyzeOrderTime(): { suspicious: boolean; issue: string } {
  const now = new Date();
  const hour = now.getHours();
  
  // Flag orders placed at unusual hours (3 AM - 6 AM)
  if (hour >= 3 && hour < 6) {
    return { 
      suspicious: true, 
      issue: 'Order placed during unusual hours (3-6 AM)' 
    };
  }
  
  return { suspicious: false, issue: '' };
}

function cleanAddress(address: string): string {
  // Clean and standardize address format
  let cleaned = address.trim();
  
  // Capitalize first letter of each word
  cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());
  
  // Standardize common abbreviations
  cleaned = cleaned.replace(/\bStreet\b/gi, 'St');
  cleaned = cleaned.replace(/\bAvenue\b/gi, 'Ave');
  cleaned = cleaned.replace(/\bRoad\b/gi, 'Rd');
  cleaned = cleaned.replace(/\bDrive\b/gi, 'Dr');
  cleaned = cleaned.replace(/\bLane\b/gi, 'Ln');
  cleaned = cleaned.replace(/\bBoulevard\b/gi, 'Blvd');
  
  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
}