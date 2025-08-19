import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});
const snsClient = new SNSClient({});

interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  numberOfGuests: number;
  status: string;
  specialRequests?: string;
}

export const handler = async () => {
  console.log('Starting reservation reminder process...');
  
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  
  try {
    // Get today's date in YYYY-MM-DD format
    const today = now.toISOString().split('T')[0];
    
    // Scan for reservations
    // In production, use Query with GSI for better performance
    const scanParams = {
      TableName: process.env.RESERVATION_TABLE_NAME || 'Reservation',
      FilterExpression: '#date = :today AND #status = :confirmed',
      ExpressionAttributeNames: {
        '#date': 'date',
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':today': today,
        ':confirmed': 'confirmed'
      }
    };
    
    const result = await docClient.send(new ScanCommand(scanParams));
    const reservations = (result.Items || []) as Reservation[];
    
    console.log(`Found ${reservations.length} confirmed reservations for today`);
    
    // Process each reservation
    for (const reservation of reservations) {
      const reservationTime = new Date(`${reservation.date}T${reservation.time}`);
      const timeDiff = reservationTime.getTime() - now.getTime();
      const hoursUntil = timeDiff / (1000 * 60 * 60);
      
      // Send reminder if reservation is within 2-2.5 hours
      if (hoursUntil > 1.5 && hoursUntil <= 2.5) {
        await sendReminder(reservation);
      }
    }
    
    return {
      statusCode: 200,
      message: `Processed ${reservations.length} reservations`
    };
    
  } catch (error) {
    console.error('Error processing reminders:', error);
    throw error;
  }
};

async function sendReminder(reservation: Reservation) {
  const { customerName, email, phone, time, numberOfGuests } = reservation;
  
  // Format time nicely (e.g., "7:00 PM")
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  const formattedTime = `${displayHour}:${minutes} ${ampm}`;
  
  // Email reminder
  if (email) {
    const emailParams = {
      Source: 'noreply@goldendragon.com',
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: `🥟 Reminder: Your table at Golden Dragon is reserved for ${formattedTime}`
        },
        Body: {
          Html: {
            Data: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center;">
                  <h1 style="margin: 0;">🥟 Golden Dragon Restaurant</h1>
                  <p style="margin: 10px 0 0 0;">Authentic Chinese Cuisine</p>
                </div>
                
                <div style="padding: 30px; background: #fff;">
                  <h2 style="color: #991b1b;">Hi ${customerName}! 👋</h2>
                  
                  <p style="font-size: 18px; color: #333;">
                    This is a friendly reminder that your table for <strong>${numberOfGuests} ${numberOfGuests === 1 ? 'guest' : 'guests'}</strong> 
                    is reserved for <strong style="color: #991b1b;">${formattedTime} today</strong>.
                  </p>
                  
                  <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400e;">
                      <strong>🎁 Early Bird Special:</strong> Arrive 15 minutes early and receive a complimentary appetizer!
                    </p>
                  </div>
                  
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #991b1b;">Reservation Details:</h3>
                    <p style="margin: 5px 0;">📅 Date: Today</p>
                    <p style="margin: 5px 0;">🕐 Time: ${formattedTime}</p>
                    <p style="margin: 5px 0;">👥 Party Size: ${numberOfGuests}</p>
                    <p style="margin: 5px 0;">📍 Location: 123 Main Street, New York, NY</p>
                  </div>
                  
                  <p style="color: #666;">
                    We're looking forward to serving you! Our chef has prepared some amazing specials today.
                  </p>
                  
                  <p style="color: #666;">
                    Need to modify or cancel? Call us at <strong>(555) 123-4567</strong>
                  </p>
                </div>
                
                <div style="background: #991b1b; color: white; padding: 20px; text-align: center;">
                  <p style="margin: 0;">Golden Dragon Restaurant | 金龙餐厅</p>
                  <p style="margin: 5px 0; font-size: 14px;">123 Main Street, New York, NY 10001</p>
                </div>
              </div>
            `
          }
        }
      }
    };
    
    try {
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log(`Email reminder sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
    }
  }
  
  // SMS reminder (if phone number is provided)
  if (phone) {
    const smsMessage = `🥟 Golden Dragon: Hi ${customerName}! Your table for ${numberOfGuests} is reserved for ${formattedTime} today. Arrive 15 min early for a free appetizer! Need to change? Call (555) 123-4567`;
    
    const smsParams = {
      PhoneNumber: phone,
      Message: smsMessage
    };
    
    try {
      await snsClient.send(new PublishCommand(smsParams));
      console.log(`SMS reminder sent to ${phone}`);
    } catch (error) {
      console.error(`Failed to send SMS to ${phone}:`, error);
    }
  }
}