# 🚀 Quick Google OAuth Setup for Golden Dragon

## ⚠️ IMPORTANT: This will recreate your user pool (delete existing users)

## Step 1: Get Google OAuth Credentials

### 1.1 Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "Golden Dragon Restaurant"
4. Click "Create"

### 1.2 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External**
3. Fill in:
   - App name: `Golden Dragon Restaurant`
   - User support email: `your-email@example.com`
   - Developer contact: `your-email@example.com`
4. Click "Save and Continue"
5. Add scopes: Click "Add or Remove Scopes"
   - Check: `userinfo.email`
   - Check: `userinfo.profile`
   - Check: `openid`
6. Save and Continue → Back to Dashboard

### 1.3 Create OAuth Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Golden Dragon Web App`
5. **Authorized JavaScript origins** - Add:
   ```
   http://localhost:3000
   http://localhost:3002
   ```
6. **Authorized redirect URIs** - For now, add a placeholder:
   ```
   http://localhost:3002/oauth-callback
   ```
   (We'll update this after getting the Cognito domain)
7. Click **Create**
8. **SAVE YOUR CREDENTIALS:**
   - Client ID: `[YOUR_CLIENT_ID].apps.googleusercontent.com`
   - Client Secret: `[YOUR_CLIENT_SECRET]`

## Step 2: Add Secrets to Amplify

Run these commands one by one:

```bash
# First, delete the old sandbox
npx ampx sandbox delete --yes

# Add Google Client ID secret
npx ampx sandbox secret set GOOGLE_CLIENT_ID
# When prompted, paste your Client ID

# Add Google Client Secret
npx ampx sandbox secret set GOOGLE_CLIENT_SECRET  
# When prompted, paste your Client Secret
```

## Step 3: Deploy the New Sandbox

```bash
# Start the sandbox (this will create a new user pool with OAuth)
npx ampx sandbox
```

Wait for deployment to complete (about 3-5 minutes).

## Step 4: Get Your Cognito Domain

After deployment completes, look for output like:
```
Cognito Domain: amplify-bifeiamplifyapp-bifeihao-sandbox-XXXXX
```

Or find it in the AWS Console:
1. Go to AWS Cognito Console
2. Find your user pool (starts with `amplify-bifeiamplifyapp`)
3. Go to "App integration" tab
4. Look for "Cognito domain"

Your full redirect URI will be:
```
https://[YOUR-COGNITO-DOMAIN].auth.us-east-1.amazoncognito.com/oauth2/idpresponse
```

## Step 5: Update Google OAuth Redirect URI

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, remove the placeholder and add:
   ```
   https://[YOUR-COGNITO-DOMAIN].auth.us-east-1.amazoncognito.com/oauth2/idpresponse
   ```
5. Click **Save**

## Step 6: Re-enable Google Sign-In Button

The button is already configured in your login page. It will automatically appear once OAuth is properly configured.

## Step 7: Test It!

1. Go to http://localhost:3002/login
2. Click "Continue with Google"
3. Sign in with your Google account
4. You'll be redirected back and logged in!

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the Cognito domain in your redirect URI matches EXACTLY
- No trailing slashes
- Must be HTTPS (not HTTP)

### "OAuth param not configured" Error
- Secrets not set properly - re-run the secret commands
- Sandbox needs to be redeployed after adding secrets

### Finding Cognito Domain via CLI
```bash
aws cognito-idp list-user-pools --max-results 10 --region us-east-1
```

Then:
```bash
aws cognito-idp describe-user-pool --user-pool-id [YOUR_POOL_ID] --region us-east-1 | grep Domain
```