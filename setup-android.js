#!/usr/bin/env node

/**
 * Android App Setup Script for NinjaTech QR Helper
 * This script helps set up the Android app for Play Store deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NinjaTech QR Helper - Android Setup');
console.log('=====================================\n');

function runCommand(command, description) {
    try {
        console.log(`📋 ${description}...`);
        execSync(command, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`✅ ${description} completed\n`);
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        process.exit(1);
    }
}

function checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');

    // Check Node.js
    try {
        execSync('node --version', { stdio: 'pipe' });
        console.log('✅ Node.js found');
    } catch {
        console.error('❌ Node.js not found. Please install Node.js 16+');
        process.exit(1);
    }

    // Check npm
    try {
        execSync('npm --version', { stdio: 'pipe' });
        console.log('✅ npm found');
    } catch {
        console.error('❌ npm not found');
        process.exit(1);
    }

    // Check Java
    try {
        execSync('java -version', { stdio: 'pipe' });
        console.log('✅ Java found');
    } catch {
        console.error('❌ Java not found. Please install JDK 11+');
        process.exit(1);
    }

    console.log('✅ Prerequisites check completed\n');
}

function generateIcons() {
    console.log('🎨 Generating app icons...');

    // Check if icons directory exists
    if (!fs.existsSync('icons')) {
        fs.mkdirSync('icons');
        console.log('📁 Created icons directory');
    }

    // Run icon generation
    runCommand('node generate-icons.js', 'Generate PNG icons');

    console.log('✅ Icon generation completed\n');
}

function setupCapacitor() {
    console.log('⚡ Setting up Capacitor...');

    // Check if capacitor.config.json exists
    if (!fs.existsSync('capacitor.config.json')) {
        console.error('❌ capacitor.config.json not found');
        process.exit(1);
    }

    // Initialize Capacitor if not already done
    if (!fs.existsSync('android')) {
        runCommand('npx @capacitor/cli init "NinjaTech QR Helper" "com.ninjatech.qrhelper" --web-dir=.', 'Initialize Capacitor');
        runCommand('npm install @capacitor/android', 'Install Android platform');
        runCommand('npx cap add android', 'Add Android platform');
    } else {
        console.log('📱 Android platform already exists');
    }

    // Sync web assets
    runCommand('npx cap sync android', 'Sync web assets to Android');

    console.log('✅ Capacitor setup completed\n');
}

function buildAndroid() {
    console.log('🔨 Building Android app...');

    // Check if android directory exists
    if (!fs.existsSync('android')) {
        console.error('❌ Android project not found. Run setup first.');
        process.exit(1);
    }

    // Build Android app
    runCommand('cd android && ./gradlew assembleDebug', 'Build debug APK');

    console.log('✅ Android build completed\n');
    console.log('📦 APK location: android/app/build/outputs/apk/debug/app-debug.apk');
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'all';

    switch (command) {
        case 'check':
            checkPrerequisites();
            break;

        case 'icons':
            generateIcons();
            break;

        case 'setup':
            checkPrerequisites();
            generateIcons();
            setupCapacitor();
            break;

        case 'build':
            buildAndroid();
            break;

        case 'all':
            checkPrerequisites();
            generateIcons();
            setupCapacitor();
            buildAndroid();
            console.log('🎉 Android app setup completed!');
            console.log('\n📋 Next steps:');
            console.log('1. Open Android Studio: npm run capacitor:open');
            console.log('2. Test on device: Connect device and run: npx cap run android');
            console.log('3. For Play Store: Build release version and upload AAB file');
            break;

        default:
            console.log('Usage: node setup-android.js [command]');
            console.log('Commands:');
            console.log('  check  - Check prerequisites');
            console.log('  icons  - Generate app icons');
            console.log('  setup  - Full setup (check + icons + capacitor)');
            console.log('  build  - Build Android APK');
            console.log('  all    - Complete setup (default)');
            break;
    }
}

if (require.main === module) {
    main();
}
