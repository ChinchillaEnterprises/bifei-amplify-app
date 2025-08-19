# Google OAuth Setup Guide for Golden Dragon Restaurant

## Prerequisites
- Google Cloud Console account
- AWS Amplify sandbox running

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Name it: "Golden Dragon Restaurant Auth"

## Step 2: Configure OAuth Consent Screen

1. Go to **OAuth consent screen** in the sidebar
2. Choose **External** user type
3. Fill in the required fields:
   - App name: "Golden Dragon Restaurant"
   - User support email: Your email
   - Developer contact: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

## Step 3: Set Authorized Redirect URIs

In your OAuth client ID settings, add these **Authorized redirect URIs**:

```
https://YOUR-COGNITO-DOMAIN.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```

To find your Cognito domain:
1. Check your `amplify_outputs.json` file
2. Or run: `npx ampx sandbox status`

For local development, your domain will look like:
```
https://amplify-bifeiamplifyapp-bifeihao-sandbox-XXXXX.auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```

## Step 4: Set Authorized JavaScript Origins

Add these origins:
```
http://localhost:3000
http://localhost:3002
https://YOUR-PRODUCTION-DOMAIN.com (when ready)
```

## Step 5: Copy Your Credentials

After creating the OAuth client, you'll get:
- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: A long string of characters

## Step 6: Add Secrets to Amplify

Run these commands to add your Google credentials as secrets:

```bash
# Add Google Client ID
npx ampx sandbox secret set GOOGLE_CLIENT_ID
# Paste your Client ID when prompted

# Add Google Client Secret  
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET
# Paste your Client Secret when prompted
```

## Step 7: Redeploy the Sandbox

The sandbox should automatically redeploy after adding secrets. If not:

```bash
# Stop current sandbox (Ctrl+C)
# Restart sandbox
npx ampx sandbox
```

## Step 8: Update Frontend Code

Once OAuth is configured, update `/app/login/page.tsx`:

```tsx
<Authenticator
  socialProviders={['google']}  // Re-add this line
  formFields={{
    // ... rest of your config
  }}
>
```

## Troubleshooting

### "OAuth param not configured" Error
- Ensure secrets are set correctly
- Check that sandbox has redeployed
- Verify redirect URIs match exactly

### "Invalid redirect_uri" Error
- Double-check the Cognito domain in redirect URI
- Ensure no trailing slashes
- Verify URI is added to Google Console

### Finding Your Cognito Domain
Look in CloudFormation console or run:
```bash
aws cognito-idp describe-user-pool-domain --domain YOUR-DOMAIN --region us-east-1
```

## Testing

1. Go to http://localhost:3002/login
2. Click "Sign in with Google"
3. Authorize the app
4. You should be redirected back and logged in!

## Production Setup

When ready for production:
1. Add your production URL to callback/logout URLs in `amplify/auth/resource.ts`
2. Add production redirect URI to Google Console
3. Update JavaScript origins in Google Console
4. Redeploy with `npx ampx pipeline-deploy`