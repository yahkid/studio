
import com.android.build.api.dsl.ApplicationExtension

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.holyspiritconnect.hscapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.holyspiritconnect.hscapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
     buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(platform(libs.firebase.bom))
    implementation(libs.core.ktx)
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.constraintlayout)
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.fragment.ktx)
    implementation(libs.recyclerview)
    implementation(libs.glide)
    implementation(libs.lifecycle.viewmodel.ktx)
    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
}

// TODO(you): The `com.android.application` plugin has been applied to this module, so you need
// to configure an `android` block, as well as `kotlin` and `dependencies` blocks.
//
// For more details, see https://developer.android.com/studio/build
//
// To configure this module for building an Android app, you will need to add, at a minimum,
// the following properties to this file, inside an `android` block:
//
//    namespace = "com.hscmconnect.app"
//    compileSdk = 34
//
//    defaultConfig {
//        applicationId = "com.hscmconnect.app"
//        minSdk = 24
//        targetSdk = 34
//        versionCode = 1
//        versionName = "1.0"
//    }
//
// For more information, see https://developer.android.com/studio/build/configure-app-module.
//
// To get started with writing code in this module, creating a new file at
// src/main/kotlin/com/hscmconnect/app/MainActivity.kt.
//
// You will also need to create a new file at src/main/res/values/strings.xml to add
// string resources to your project.
//
// You may also need to add an `activity` to your src/main/AndroidManifest.xml file.
// <activity android:name=".MainActivity" android:exported="true">
//     <intent-filter>
//         <action android:name="android.intent.action.MAIN" />
//         <category android:name="android.intent.category.LAUNCHER" />
//     </intent-filter>
// </activity>
//
// For more information, see https://developer.android.com/guide/components/activities/activity-element.
//
// You may also need to create a theme for your app. To do so, create a new file at
// src/main/res/values/themes.xml with a `style` element.
// <style name="Theme.App" parent="Theme.Material.Components.DayNight.NoActionBar" />
//
// For more information, see https://developer.android.com/develop/ui/views/theming/themes.
//
// Finally, you will need to add the `application` element to your src/main/AndroidManifest.xml file.
// <application
//     android:allowBackup="true"
//     android:icon="@mipmap/ic_launcher"
//     android:label="@string/app_name"
//     android:roundIcon="@mipmap/ic_launcher_round"
//     android:supportsRtl="true"
//     android:theme="@style/Theme.App" />
//
// For more information, see https://developer.android.com/guide/topics/manifest/application-element.
//
//
// Please remove this comment once you have configured this module.
fun configure<T>(block: T.() -> Unit): T.() -> Unit = block

// The `android` block is what configures this module as an Android application.
// You can learn more about this block at https://developer.android.com/reference/tools/gradle-api/7.3/com/android/build/api/dsl/ApplicationExtension
//
// The `kotlin` block is what configures this module as a Kotlin module.
//
// The `dependencies` block is what configures the dependencies for this module.
// You can learn more about this block at https://developer.android.com/studio/build/dependencies
//
// The `plugins` block is what applies the plugins to this module.
// You can learn more about this block at https://developer.android.com/studio/build/plugins
//
// The `com.android.application` plugin is what configures this module as an Android application.
// You can learn more about this plugin at https://developer.android.com/studio/build/gradle-plugin-api
//
// The `org.jetbrains.kotlin.android` plugin is what configures this module as a Kotlin module.
// You can learn more about this plugin at https://kotlinlang.org/docs/gradle.html
//
// The `com.google.gms.google-services` plugin is what configures this module to use Google
// services.
// You can learn more about this plugin at https://developers.google.com/android/guides/google-services-plugin
//
// The `com.google.firebase.crashlytics` plugin is what configures this module to use Firebase
// Crashlytics.
// You can learn more about this plugin at https://firebase.google.com/docs/crashlytics/get-started?platform=android
//
// The `com.google.firebase.perf` plugin is what configures this module to use Firebase
// Performance Monitoring.
// You can learn more about this plugin at https://firebase.google.com/docs/perf-mon/get-started-android
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
-keep class com.google.firebase.crashlytics.** { *; }
-keep class com.google.firebase.perf.** { *; }
