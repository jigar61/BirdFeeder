# iOS TestFlight Deployment Guide

## Overview
This guide explains how to set up automated TestFlight deployments for the BirdGame app using GitHub Actions.

## Prerequisites

1. **Apple Developer Program Membership** ($99/year)
2. **Active App Store Connect account**
3. **Git tags** for versioning (e.g., `v1.0.0`)

## Step-by-Step Setup

### 1. Create App ID in Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Identifiers**
3. Click **+** to create a new App ID
4. Enter a Bundle ID (e.g., `com.jigar.birdgame`)
5. Configure capabilities (push notifications, etc.)
6. Save and note the Bundle ID

### 2. Generate Distribution Certificate

1. In Apple Developer Portal, go to **Certificates, Identifiers & Profiles**
2. Click **Certificates**
3. Select **+** to create a new certificate
4. Choose **Apple Distribution** (for App Store/TestFlight)
5. Follow the prompts to upload a CSR
6. Download the `.cer` file
7. Double-click to install in Keychain

### 3. Export Certificate as .p12

1. Open **Keychain Access**
2. Find your distribution certificate (name: "Apple Distribution: Your Name")
3. Right-click → **Export "Apple Distribution: Your Name"**
4. Save as `distribution_cert.p12`
5. Set a password (you'll need this for GitHub Secrets)
6. Convert to base64:
   ```bash
   base64 -i distribution_cert.p12 | pbcopy
   # (paste into GitHub Secret)
   ```

### 4. Create Provisioning Profile

1. In Developer Portal, go to **Provisioning Profiles**
2. Click **+** to create new profile
3. Select **App Store** as the type
4. Select your App ID
5. Select your distribution certificate
6. Name it `BirdGame AppStore`
7. Download the `.mobileprovision` file
8. Convert to base64:
   ```bash
   base64 -i BirdGame_AppStore.mobileprovision | pbcopy
   ```

### 5. Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **Users and Access** → **Integrations** → **App Store Connect API**
3. Click **+** to create new API key
4. Select **Admin** role
5. Name it `GitHub Actions BirdGame`
6. Download the `.p8` file
7. Note the **Key ID** and **Issuer ID**
8. Convert to base64:
   ```bash
   base64 -i AuthKey_*.p8 | pbcopy
   ```

### 6. Add GitHub Secrets

In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

| Secret Name | Value |
|---|---|
| `IOS_DISTRIBUTION_CERT_BASE64` | Base64-encoded .p12 certificate |
| `IOS_DISTRIBUTION_CERT_PASSWORD` | Password used when exporting .p12 |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded .mobileprovision file |
| `IOS_DEVELOPER_TEAM_ID` | Your 10-character Team ID (from Developer Portal) |
| `IOS_API_KEY_BASE64` | Base64-encoded .p8 API key file |
| `IOS_API_KEY_ID` | Key ID from App Store Connect |
| `IOS_API_ISSUER_ID` | Issuer ID from App Store Connect |
| `APPSTORE_CONNECT_EMAIL` | Your App Store Connect email |
| `APPSTORE_CONNECT_PASSWORD` | Your App Store Connect password (or app-specific password) |

### 7. Update iOS App Configuration

Update `ios/App/App/Info.plist`:
```xml
<key>CFBundleIdentifier</key>
<string>com.jigar.birdgame</string>
```

Update `ios/App/ExportOptions.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
```

### 8. Create an App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** to create new app
3. Select **iOS**
4. Fill in app details:
   - **Name**: Bird Feed Chase
   - **Bundle ID**: com.jigar.birdgame (must match your provisioning profile)
   - **SKU**: unique identifier (e.g., BIRDGAME001)
   - **User Access**: select appropriate level

### 9. Deploy to TestFlight

#### Option A: Using Git Tags (Automatic)

Push a version tag to trigger automatic TestFlight deployment:
```bash
git tag v1.0.0
git push origin v1.0.0
```

This will automatically trigger the `testflight-deploy.yml` workflow.

#### Option B: Manual Dispatch (On-Demand)

1. Go to GitHub repository → **Actions**
2. Select **Deploy to TestFlight** workflow
3. Click **Run workflow**
4. Enter version (e.g., `v1.0.0`)
5. Click **Run workflow**

### 10. Monitor TestFlight Upload

1. Check GitHub Actions for workflow status
2. Once build completes, check [App Store Connect](https://appstoreconnect.apple.com)
3. Navigate to your app → **TestFlight** tab
4. Look for your build under **Internal Testing** or **External Testing**
5. Invite testers and create test links

## Troubleshooting

### "Certificate is not valid" error
- Ensure the distribution certificate hasn't expired
- Re-export the certificate and update GitHub Secrets

### "Provisioning profile not found" error
- Verify the Bundle ID matches your provisioning profile
- Re-download and encode the provisioning profile

### "Authentication failed" error
- Check App Store Connect credentials
- Consider using app-specific passwords for better security
- Ensure API key has Admin role

### Build fails at "archive" step
- Check Xcode build logs in workflow artifacts
- Ensure all dependencies are resolved (check CocoaPods versions)
- Verify minimum iOS deployment target compatibility

## Additional Security

### Using App-Specific Passwords
Instead of your main App Store Connect password, create an app-specific password:

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in with your Apple ID
3. Click **Security** section
4. Under **App-Specific Passwords**, click **Generate**
5. Select **App Store Connect**
6. Use this password in GitHub Secrets instead

### Revoking Secrets
If you accidentally commit secrets:
1. Immediately revoke all tokens/certificates in Developer Portal
2. Rotate GitHub Secrets
3. Force push to remove from history (not recommended for shared repos)

## Next Steps After TestFlight

Once tested successfully on TestFlight:

1. **Prepare App Store Submission**
   - Write app description
   - Add screenshots
   - Set pricing and availability
   - Fill in review information

2. **Submit for Review**
   - In App Store Connect, click **Submit for Review**
   - Apple reviews in 24-48 hours typically

3. **App Store Release**
   - Once approved, click **Release** to make public

## Versioning Strategy

For semantic versioning:
- `v1.0.0` - Major release
- `v1.0.1` - Bug fix
- `v1.1.0` - Feature release

Each tag triggers a new TestFlight build automatically.

## Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Xcode Build Process Guide](https://developer.apple.com/library/archive/technotes/tn2420/)
