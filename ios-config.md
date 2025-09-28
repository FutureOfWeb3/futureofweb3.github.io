# 🍎 iOS Build Configuration Guide

## Prerequisites (Mac Only)
1. **macOS** - iOS development requires Mac
2. **Xcode** - Latest version from Mac App Store
3. **Apple Developer Account** - $99/year
4. **iOS Simulator** - Included with Xcode

## Build Steps

### 1. Run Setup Script
```bash
# Run the build setup  
npm run ios:build
```

### 2. Configure Xcode Project
1. Xcode opens automatically
2. Select project "App" in navigator
3. Update these settings:

**General Tab:**
- Display Name: `QR Ninja`
- Bundle Identifier: `com.ninjatechhq.qrgenerator`
- Version: `1.0`
- Build: `1`
- Deployment Target: `iOS 12.0`

**Signing & Capabilities:**
- Team: [Your Apple Developer Team]
- Automatically manage signing: ✅
- Bundle Identifier: `com.ninjatechhq.qrgenerator`

### 3. Add App Icons in Xcode
1. Open `ios/App/App/Assets.xcassets`
2. Select `AppIcon`
3. Drag PNG icons to appropriate slots:
   - iPhone 60pt (120x120, 180x180)
   - iPad 76pt (152x152, 167x167) 
   - App Store 1024pt (1024x1024)

### 4. Configure Info.plist
File: `ios/App/App/Info.plist`

Add these keys:
```xml
<key>CFBundleDisplayName</key>
<string>QR Ninja</string>
<key>CFBundleName</key>
<string>QR Ninja</string>
<key>NSCameraUsageDescription</key>
<string>Camera access needed for QR code scanning</string>
<key>UIRequiredDeviceCapabilities</key>
<array>
    <string>armv7</string>
</array>
```

### 5. Build for Testing
```bash
# Build for simulator
npx cap run ios

# Build for device (requires Apple Developer account)
npx cap run ios --target="[Device Name]"
```

### 6. Archive for App Store
1. In Xcode: Product → Archive
2. When complete, click "Distribute App"
3. Choose "App Store Connect"
4. Follow upload wizard

## App Store Connect Setup

### App Information
- **Name**: QR Ninja  
- **Subtitle**: Code Generator
- **Bundle ID**: com.ninjatechhq.qrgenerator
- **SKU**: qr-ninja-2024
- **Category**: Utilities
- **Content Rights**: Does not use encryption

### Version Information
- **Version**: 1.0
- **Copyright**: 2024 NinjaTech
- **Trade Representative Contact**: [Your info]
- **Review Information**: [Your contact details]

### App Store Assets Required
- **App Icon**: 1024x1024 PNG
- **iPhone Screenshots**: 
  - 6.7" Display (1290x2796)
  - 6.5" Display (1242x2688) 
  - 5.5" Display (1242x2208)
- **iPad Screenshots**:
  - 12.9" Display (2048x2732)
  - 11" Display (1668x2388)

### Store Listing
```
App Name: QR Ninja
Subtitle: Master Digital Stealth

Description:
🥷 Master the art of digital stealth with QR Ninja!

Create stunning QR codes with ninja precision and style. Whether you're a business professional, event organizer, or creative enthusiast, QR Ninja transforms ordinary codes into powerful digital tools.

✨ NINJA FEATURES:
• Instant QR code generation from any text or URL
• Custom logo embedding with adjustable sizing  
• High-resolution PNG downloads
• Mystical ninja-themed interface with cloud effects
• Lightning-fast offline functionality
• Professional-grade output quality

🎯 PERFECT FOR:
• Business cards and marketing materials
• Event invitations and tickets
• Restaurant menus and contact sharing
• Social media promotion
• Creative projects and artwork

🔥 ADVANCED CAPABILITIES:
• Real-time preview with logo integration
• Multiple QR size options (200px-500px)
• Logo size control (15%-30% of QR)
• Offline-first design
• Native iOS performance

Experience the perfect blend of functionality and artistry. Download QR Ninja and unleash your digital stealth powers!

Keywords: QR, barcode, generator, business, ninja, marketing
```

### Pricing & Availability
- **Price**: Free
- **Availability**: All countries
- **App Store Distribution**: Available

## 🚀 Submission Checklist

- [ ] Xcode project configured
- [ ] App icons added to Xcode
- [ ] Build successful on device
- [ ] Screenshots captured on all device sizes
- [ ] App Store Connect app created
- [ ] Privacy policy URL added
- [ ] App description and keywords finalized
- [ ] Apple Developer account active ($99/year)
- [ ] Archive uploaded to App Store Connect
- [ ] App submitted for review

## Review Guidelines Compliance

Ensure your app meets Apple's guidelines:
- [ ] No crashes or major bugs
- [ ] Respects user privacy
- [ ] Provides clear value to users
- [ ] Uses iOS design patterns
- [ ] No placeholder content
- [ ] Proper error handling
- [ ] Works on all supported devices

## Estimated Timeline
- **Setup & Build**: 2-3 hours
- **Asset Creation**: 4-6 hours  
- **App Store Review**: 24-48 hours
- **Total**: 1-2 days to approval
