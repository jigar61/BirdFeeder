# iOS Deployment via GitHub Actions

## Overview

Your Bird Game now builds iOS apps automatically on GitHub's macOS runners. No Xcode needed on your Windows machine!

## How It Works

1. **You push code to GitHub** → GitHub Actions automatically:
   - Compiles TypeScript
   - Prepares web assets
   - Syncs with Capacitor
   - Installs CocoaPods dependencies
   - Builds the iOS app via Xcode (on macOS)
   - Generates an `.ipa` file

2. **Download the `.ipa`** from GitHub Actions Artifacts
3. **Deploy to TestFlight or App Store**

## Setup Steps

### 1. Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit with iOS build workflow"
git branch -M master
git remote add origin https://github.com/YOUR_USERNAME/BirdGame.git
git push -u origin master
```

### 2. Push Your Code to GitHub

```bash
git push origin master
```

### 3. Watch the Build

- Go to your GitHub repo: `https://github.com/YOUR_USERNAME/BirdGame`
- Click **Actions** tab
- Click the **Build iOS App** workflow
- Watch the build progress (takes ~10-15 minutes)

### 4. Download the IPA

When the build completes:
- Click the workflow run
- Scroll to **Artifacts** section
- Download `birdgame-ios.zip`
- Extract and you'll have `App.ipa`

## Deployment Options

### Option A: TestFlight (Easiest for Beta Testing)

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create an app or select your existing one
3. Go to **TestFlight** → **iOS Builds**
4. Click **+ Select a Build to Test**
5. Upload the `.ipa` file
6. Add testers and send invites

### Option B: App Store (Production Release)

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to **App Store** → **iOS App**
3. Click **+ Version or Platform**
4. Upload the `.ipa` file
5. Fill in app details, screenshots, description
6. Submit for review

### Option C: Direct Installation (Development/Testing)

Use **Transporter** (free Apple tool) or paste the `.ipa` URL directly to testers:

```bash
# On macOS:
xcrun altool --upload-app -f App.ipa -t ios -u apple@example.com -p APP_PASSWORD
```

## Automatic Releases (Optional)

To automatically create GitHub Releases with `.ipa` files when you tag:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

The workflow will automatically upload the `.ipa` to the GitHub Release.

## Troubleshooting

### Build fails with "Pod install error"

- This usually means CocoaPods dependencies failed to install
- The workflow logs show the exact error
- Check if `Podfile.lock` is in git (it should be)

### "Signing error" or "Provisioning profile not found"

- The workflow uses ad-hoc signing (no provisioning profile needed for testing)
- For App Store submission, you'll need to:
  1. Create an App ID in Apple Developer
  2. Create a Distribution Certificate
  3. Create a Provisioning Profile
  4. Update `ExportOptions.plist` in `ios/App/` with your team ID

### IPA won't install on device

- Make sure device is registered in Apple Developer
- IPA is signed with a valid provisioning profile
- Device's iOS version is 15.1 or higher (check `app.json`)

## For Future Updates

Every time you push code:

```bash
git add .
git commit -m "Update gameplay"
git push origin master
```

GitHub Actions automatically builds a new `.ipa` for you!

## Security Notes

- Never commit signing certificates to GitHub
- Use GitHub Secrets for sensitive data (certificates, passwords)
- The ad-hoc signing in the workflow is for testing only
- For production, configure proper code signing in ExportOptions.plist

## Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Xcode Build System](https://developer.apple.com/documentation/xcode)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

---

**You now have automated iOS builds without needing Xcode on Windows! 🎉**
