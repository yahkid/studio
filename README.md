# Firebase Studio Project - HSCM Connect

This is a monorepo containing the Next.js web application and the native Android application for HSCM Connect.

## Web Application

The web application is a Next.js project located in the root of this repository.

To get started, take a look at `src/app/page.tsx`.

### Running the Web App

```bash
npm install
npm run dev
```

## Android Application

The native Android application is located in the `/android` directory. You can open this directory in Android Studio to start development.

### Connecting to Firebase

To connect the Android app to your Firebase project, you must:

1.  Go to your Firebase Project Settings.
2.  Under "Your apps", click "Add app" and select the Android icon.
3.  Use the package name `com.hscmconnect.app`.
4.  Download the generated `google-services.json` file.
5.  Replace the placeholder file at `android/app/google-services.json` with the file you just downloaded.
