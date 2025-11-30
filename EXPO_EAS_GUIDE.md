# Expo EAS Build and Submission Guide

This guide explains how to build and submit your Bird Game app to TestFlight and Google Play using Expo EAS (Expo Application Services).

## Why Expo/EAS?

✅ **Advantages:**
- No need for local Xcode or Android SDK setup
- Cloud-based builds (no Mac required for iOS)
- Automatic code signing and provisioning
- Single command for iOS and Android builds
- Easy TestFlight and Google Play submission
- Faster CI/CD pipeline

## Prerequisites

1. **Expo Account** - Create at [expo.dev](https://expo.dev)
2. **EAS CLI** - Install with `npm install -g eas-cli`
3. **Apple Developer Account** - For TestFlight/App Store submission
4. **Google Play Developer Account** - For Google Play submission

## Setup Steps

### 1. Initialize Expo Project

Your project is already Expo-enabled (you have `app.json` and `eas.json`). Verify your configuration:

```bash
cd BirdGame
eas project:info
```

Update `app.json` with your app details:

```json
{
  "expo": {
    "name": "Bird Feed Chase",
    "slug": "birdgame",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.birdgame",
      "supportsTabletMode": true
    },
    "android": {
      "package": "com.yourcompany.birdgame",
      "supportsRtl": true
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

### 2. Set Up iOS Build (TestFlight)

#### Option A: Automatic (Recommended)

```bash
eas build --platform ios --auto
```

This will:
- Create iOS credentials automatically
- Set up provisioning profiles
- Handle all certificate management
- Store everything securely in EAS

#### Option B: Manual Setup

If you already have certificates:

```bash
eas credentials
```

Then follow the prompts to upload your:
- Distribution certificate (`.p12`)
- Provisioning profile
- Push notification certificate (optional)

### 3. Set Up Android Build (Google Play)

#### Option A: Automatic

```bash
eas build --platform android --auto
```

This will:
- Generate or use existing keystore
- Set up signing credentials
- Store securely in EAS

#### Option B: Manual Setup

```bash
eas credentials
```

Upload your keystore and signing credentials.

### 4. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret | Value | How to Get |
|--------|-------|-----------|
| `EXPO_TOKEN` | Your Expo auth token | Run `eas whoami` (copy from `~/.expo/`) |
| `EAS_PROJECT_ID` | Your EAS project ID | From `app.json` `extra.eas.projectId` |
| `EXPO_USERNAME` | Your Expo username | Your Expo account username |
| `APPLE_DEVELOPER_TEAM_ID` | (Optional) Your Apple Team ID | Apple Developer Portal |

**To get your EXPO_TOKEN:**

```bash
# Login to Expo
expo login

# Find your token
cat ~/.expo/state.json | grep "sessionSecret"
# or use the token directly
eas whoami
```

### 5. Configure EAS Build Settings

Your `eas.json` already has basic config. Enhance it:

```json
{
  "cli": {
    "version": ">= 5.4.0",
    "promptToConfigurePushNotifications": false
  },
  "build": {
    "development": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "default"
      },
      "android": {
        "resourceClass": "default"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "default"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "ios": {
        "resourceClass": "default"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "testFlightAudience": "External Testers"
      }
    }
  }
}
```

### 6. Create an App in App Stores

#### For TestFlight (iOS)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+ Create new app**
3. Select **iOS**
4. Fill in:
   - Name: "Bird Feed Chase"
   - Bundle ID: "com.yourcompany.birdgame"
   - SKU: unique identifier
5. Click **Create**

#### For Google Play (Android)

1. Go to [Google Play Console](https://play.google.com/console)
2. Click **Create app**
3. Fill in:
   - App name: "Bird Feed Chase"
   - Default language: English
4. Accept agreements and create

### 7. Build Locally (Test Before CI/CD)

```bash
# Build for iOS (TestFlight)
eas build --platform ios --profile production

# Build for Android (Google Play)
eas build --platform android --profile production

# Build both
eas build --platform all --profile production
```

Monitor build progress:
```bash
eas build:list
```

### 8. Submit to App Stores

#### Submit to TestFlight

```bash
eas submit --platform ios --latest
```

Or configure auto-submit in `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "testFlightAudience": "External Testers"
      }
    }
  }
}
```

Then builds auto-submit with `eas submit --latest`.

#### Submit to Google Play

```bash
eas submit --platform android --latest
```

Configure in `eas.json`:
```json
{
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      }
    }
  }
}
```

### 9. GitHub Actions Workflow

The workflow file `.github/workflows/eas-build.yml` is configured. Now set it up:

#### Option 1: Automatic builds on tags

Push a version tag to build and submit automatically:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers:
1. Build for iOS and Android
2. Submit to TestFlight and Google Play
3. Create GitHub release

#### Option 2: Manual builds

Go to **GitHub** → **Actions** → **EAS Build and Submit** → **Run workflow**

Choose:
- Platform: `all`, `ios`, or `android`
- Submit to stores: `true` or `false`

## Deployment Workflow

### Full Release Process

1. **Update version in `app.json`:**
   ```json
   {
     "expo": {
       "version": "1.0.1"
     }
   }
   ```

2. **Commit and push:**
   ```bash
   git add app.json
   git commit -m "Bump version to 1.0.1"
   git push origin main
   ```

3. **Create release tag:**
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

4. **Monitor build:**
   - Watch GitHub Actions workflow
   - Check [EAS Dashboard](https://expo.dev)
   - Receive email notifications on build completion

5. **Review on stores:**
   - Check TestFlight: [App Store Connect](https://appstoreconnect.apple.com)
   - Check Google Play: [Play Console](https://play.google.com/console)
   - Add testers and create review links

### Test Flight Tester Setup

1. In App Store Connect, go to **TestFlight** → **Internal Testing**
2. Click **Add Tester**
3. Invite tester with Apple ID
4. They'll receive email with TestFlight link
5. Can install directly on iOS device

### Google Play Tester Setup

1. In Play Console, go to **Testing** → **Internal testing**
2. Create a test group
3. Add testers' Google accounts
4. Testers can install via Play Store link
5. Set tester mode in Play Console

## Commands Reference

```bash
# Login to Expo
eas whoami

# Check project info
eas project:info

# Manage credentials
eas credentials

# Build locally
eas build --platform ios
eas build --platform android
eas build --platform all

# Check build status
eas build:list

# Submit to stores
eas submit --platform ios --latest
eas submit --platform android --latest

# View submission logs
eas submit:list
```

## Troubleshooting

### "Build failed: certificate not found"
```bash
# Reset credentials and reconfigure
eas credentials --platform ios --delete
eas build --platform ios --auto
```

### "EXPO_TOKEN not set"
Make sure you've added the secret to GitHub and it's accessible to Actions.

### "Build pending for long time"
Check [EAS status page](https://status.expo.io/) or view details:
```bash
eas build:view <build-id>
```

### "Android build fails with gradle"
Update Android gradle settings in `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease"
      }
    }
  }
}
```

## Security

### Protect Your Credentials

1. **Never commit secrets** - Use GitHub Secrets
2. **Rotate EXPO_TOKEN regularly** - Generate new tokens
3. **Use limited scopes** - Create tokens for specific projects only
4. **Enable 2FA** - On both Expo and Apple/Google accounts

## Cost

| Service | Cost |
|---------|------|
| Expo (basic) | Free |
| EAS Build | $29/month (or pay-as-you-go) |
| Apple Developer | $99/year |
| Google Play Developer | $25 (one-time) |

EAS Build free tier includes:
- 30 minutes build time/month
- Basic resources

## Next Steps

1. Update `app.json` with your bundle IDs
2. Add GitHub Secrets (EXPO_TOKEN, EAS_PROJECT_ID)
3. Create apps in App Store Connect and Play Console
4. Test build locally: `eas build --platform ios`
5. Push version tag to trigger GitHub Actions
6. Monitor builds and manage testers

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
