# iOS Deployment with EAS Build

## Setup Complete ✓

EAS CLI is installed and your project is configured for iOS builds. Follow these steps to build and deploy your app:

## Step 1: Login to EAS (First Time Only)

```bash
eas login
```

This will open a browser to authenticate with Expo. Create a free account at https://expo.io if you don't have one.

## Step 2: Build for iOS

```bash
eas build --platform ios
```

This command:
- Uploads your project to EAS
- Builds your iOS app in the cloud (takes ~10-15 minutes)
- Generates a `.ipa` file you can download
- No Xcode required on Windows!

## Step 3: Download and Deploy

After the build completes:

### Option A: TestFlight (Easiest for Testing)
1. Download the `.ipa` file from the EAS dashboard
2. Upload to TestFlight via App Store Connect
3. Share with testers via TestFlight

### Option B: App Store (Production Release)
1. Download the `.ipa` from EAS
2. Upload to App Store Connect
3. Submit for review

### Option C: Internal Testing
```bash
eas build --platform ios --profile preview
```
Creates an internal distribution build that can be shared directly.

## Build Profiles

Your `eas.json` has three profiles:

- **development**: Quick internal builds for testing
- **preview**: Sharable test builds
- **production**: Official App Store builds

Example:
```bash
eas build --platform ios --profile production
```

## Environment Variables (Optional)

For automated App Store submission, set in EAS dashboard:
- `APPLE_ID`: Your Apple ID email
- `APPLE_PASSWORD`: Your app-specific password

## Troubleshooting

If you get build errors:
1. Make sure your code compiles locally: `npm run build`
2. Check that all assets are in `dist/assets/`
3. Verify `app.json` bundle identifier matches your Apple ID

## For Future Updates

Each time you update your code:
```bash
npm run prepare-www
eas build --platform ios
```

Your app will be rebuilt in the cloud!

## Additional Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Capacitor Docs: https://capacitorjs.com/docs/
- App Store Connect: https://appstoreconnect.apple.com/

---

**You can now deploy to iOS without Xcode! 🎉**
