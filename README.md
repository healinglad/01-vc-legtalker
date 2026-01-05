# LegWalker

**LegWalker** is a premium, mobile-first exercise tracking application designed to help you monitor your daily activity and visualize your progress over time.

Built with **React** + **Vite** and converted to a native **Android** app using **Capacitor**.

## Features

- **Daily Logging**: Easily log your exercise duration for any date.
- **Smart Dashboard**: Instantly view your average activity for the last 7 days, 30 days, and 3 months.
- **Data Persistence**: Your data is stored locally on your device, ensuring privacy and offline access.
- **Dark Mode**: A sleek, battery-friendly dark interface.
- **Android Native**: Installable as a native APK on Android devices.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/legwalker.git
    cd legwalker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

## Building for Android

To build the APK locally, you need the Android SDK and Java (JDK 21) installed.

1.  **Sync Web Assets**:
    ```bash
    npm run build
    npx cap sync
    ```

2.  **Build APK**:
    Open the `android/` folder in **Android Studio** and run the build, or use Gradle directly:
    ```bash
    cd android
    ./gradlew assembleDebug
    ```

    The APK will be located at:
    `android/app/build/outputs/apk/debug/app-debug.apk`

## Technologies Used

- **Frontend**: React, Vite, Vanilla CSS
- **Mobile**: Capacitor
- **Storage**: LocalStorage

## License

MIT
