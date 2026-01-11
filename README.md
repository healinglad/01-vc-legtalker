# LegTalker (formerly LegWalker)

**LegTalker** is a premium, mobile-first exercise and meditation tracking application designed to help you monitor your daily activity and visualize your progress over time.

Built with **React** + **Vite** and converted to a native **Android** app using **Capacitor**.

## Key Features

### 🏋️ Active Logging
- **Dual Modes**: Track both **Exercise** (Cardio, Walking) and **Meditation** sessions.
- **Smart Dashboard**: Instantly view averages for the last 7, 30, and 90 days.
- **Calendar Visualization**: See your history at a glance with color-coded daily summaries.
- **Editable Logs**: Tap any day in the calendar to **Edit** or **Delete** entries.

### 💾 Data Safety
- **Native Export**: Backup your data to a JSON file using the native Android Share menu (Save to Drive, Email, etc.).
- **Import**: Restore your data easily from a backup file.
- **Offline First**: Your data is stored locally on your device (SQLite/LocalStorage), ensuring total privacy and offline access.

### 🎨 Design
- **Dark Mode**: A sleek, battery-friendly dark interface.
- **Mobile First**: Optimized for touch interaction and modern Android devices.

## Building for Android

To build the APK locally, this project includes a **Portable Build System** (no system-wide Java/Android SDK required).

### Prerequisites
- PowerShell (Windows)

### Build Steps
1.  **Install & Build**: Run the automated script.
    ```powershell
    ./build_with_jdk21.ps1
    ```
    This script will:
    - Set up a local JDK 21 environment.
    - Set up Android Command Line Tools.
    - Build the React web assets (`npm run build`).
    - Sync with Capacitor (`npx cap sync`).
    - Compile the Debug APK (`./gradlew assembleDebug`).

2.  **Locate APK**:
    The generic output is at: `android/app/build/outputs/apk/debug/app-debug.apk`
    
    *Note: The project root may contain named release builds like `LegTalker-v3.2.apk`.*

## Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS (Variables, Flexbox/Grid)
- **Mobile Bridge**: Capacitor 6
- **Plugins**: `@capacitor/filesystem`, `@capacitor/share`
- **Visualization**: `react-calendar`

## License

MIT
