
# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build types.

# ProGuard might be tempted to remove attributes from generated code like
# `Cmp`, `getApp` and `getInstance` in `MainApplication`.
#
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepclassmembers class **.R$* {
    public static <fields>;
}

-keepattributes Signature
-keepattributes *Annotation*

-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn com.squareup.okhttp.**
-dontwarn okio.**
-dontwarn javax.annotation.**

-keep class com.google.android.gms.common.api.internal.IStatusCallback
-keep class com.google.firebase.provider.FirebaseInitProvider
