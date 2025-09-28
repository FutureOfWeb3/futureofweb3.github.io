@echo off
echo 🥷 Setting up QR Ninja for App Store deployment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

echo 📦 Installing dependencies...
npm install

echo.
echo 🔧 Initializing Capacitor...
npx cap init "QR Ninja" "com.ninjatechhq.qrgenerator" --web-dir="."

echo.
echo 📱 Adding Android platform...
npx cap add android

echo.
echo 🍎 Adding iOS platform (if on Mac)...
npx cap add ios

echo.
echo 📋 Copying web assets...
npx cap copy

echo.
echo 🔄 Syncing projects...
npx cap sync

echo.
echo ✅ Setup complete! Next steps:
echo.
echo For Android:
echo 1. Install Android Studio from https://developer.android.com/studio
echo 2. Run: npm run android:build
echo 3. This will open Android Studio for final build
echo.
echo For iOS (Mac only):
echo 1. Install Xcode from Mac App Store
echo 2. Run: npm run ios:build  
echo 3. This will open Xcode for final build
echo.
echo 🎯 Generate app icons:
echo 1. Convert icons/app-icon.svg to PNG files using online converter
echo 2. Generate all required sizes: 16x16 to 1024x1024
echo 3. Place in icons/ folder
echo.
pause
