import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userPoolId, userName } = event;
  const email = event.request.userAttributes.email?.toLowerCase();
  
  console.log(`Post-confirmation trigger for user: ${email}`);
  
  // Determine which group to assign based on email
  let groupName = 'customer'; // Default group
  
  if (email === 'haobifei@gmail.com') {
    groupName = 'restaurantHost';
  } else if (email === 'admin@goldendragon.com') {
    groupName = 'maintenance';
  }
  
  // Add user to the appropriate group
  try {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: userName,
      GroupName: groupName,
    });
    
    await client.send(command);
    console.log(`Successfully added ${email} to group ${groupName}`);
  } catch (error) {
    console.error(`Failed to add user to group: ${error}`);
    // Don't throw error to prevent user registration from failing
  }
  
  return event;
};