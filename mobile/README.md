# Dharini Mobile

A Flutter mobile application built and managed using **Melos** and **FVM** for consistent multi-package development and SDK version management.

---

## Getting Started

Follow these steps to set up and run the project locally.

---

### Prerequisites

Before starting, make sure you have the following installed:

#### 1. **FVM**

- Install [FVM (Flutter Version Manager)](https://fvm.app/documentation/getting-started/installation)
- Then install the project’s pinned Flutter version:

```bash
  fvm install
```

- Verify:

```bash
  fvm flutter --version
```

> 💡 The project uses `.fvm/flutter_sdk` (configured in `melos.yaml`) — **don’t use your global Flutter SDK** unless it matches exactly.

#### 2. **Melos**

Used to manage multi-package workspaces (e.g., shared modules, plugins).

```bash
fvm dart pub global activate melos
```

Verify installation:

```bash
fvm dart run melos --version
```

#### 3. **Android Studio or VS Code**

- Install Flutter and Dart extensions
- Set SDK path to use `.fvm/flutter_sdk` (optional but recommended)

---

### Project Setup

1 **Clone the repository**

```bash
   git clone https://github.com/dsih-artpark/dharini.git
   cd dharini/mobile
```

2 **Install dependencies**

```bash
   fvm dart run melos bootstrap
```

3 **Generate schemas and barrels**

```bash
   fvm dart run melos run schema:generate
   fvm dart run melos run barrel:generate
```

---

### Run the App

Start the Flutter app on a connected device or emulator:

```bash
   fvm flutter run
```

If you want to target a specific platform:

```bash
fvm flutter run -d android
fvm flutter run -d ios
```

---

### Build the App

To build the app for release or debug, use the following commands:

```bash
   fvm flutter build apk   # For Android (release)
   fvm flutter build apk --debug   # For Android (debug)
```

Output release APK will be in `build/app/outputs/flutter-apk/app-release.apk`  
Output debug APK will be in `build/app/outputs/flutter-apk/app-debug.apk`

### Barcode Scanning Dependency

- Scanner: [`mobile_scanner`](https://pub.dev/packages/mobile_scanner) `^6.0.7` (locked `6.0.10`), used in `lib/views/samplecollection/scanner/barcode_scanner_screen.dart`.
- Under the hood it uses **Google ML Kit Barcode Scanning** on Android and iOS. Decoding is fully on-device.
- Android runs ML Kit in *unbundled* mode: the barcode model is downloaded via Google Play Services on first use, so devices need Play Services. To ship the model inside the APK instead, add `dev.steenbakker.mobile_scanner.useUnbundled=false` to `android/gradle.properties`.
- Licence: `mobile_scanner` is BSD-3-Clause. ML Kit is closed-source and covered by [Google's ML Kit Terms](https://developers.google.com/ml-kit/terms). It is free to use with no API key or paid licence, but the app is bound by those terms.

### Common Melos Commands

| Command                                  | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| `fvm dart run melos bootstrap`           | Installs dependencies across all packages |
| `fvm dart run melos run schema:generate` | Runs schema generation tasks              |
| `fvm dart run melos run barrel:generate` | Generates barrel files (exports)          |
| `fvm dart run melos list`                | Lists all managed packages                |
| `fvm dart run melos clean`               | Cleans Melos and Flutter build artifacts  |

---

### Notes

- Always use `fvm flutter` or configure your IDE to use `.fvm/flutter_sdk`.
- Do **not** commit build artifacts or `.cxx/`, `CMake*`, `.gradle/` files — they’re ignored in `.gitignore`.
- If `melos` commands fail, ensure FVM is properly installed and configured.
