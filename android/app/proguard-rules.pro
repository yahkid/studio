# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build types.
# You can find the rules for common libraries at
# https://www.guardsquare.com/proguard/manual/examples
-keep class com.google.android.gms.common.** { *; }
-keep public class com.google.firebase.** { *; }
-dontwarn com.google.android.gms.**
-dontwarn com.google.firebase.**
-dontwarn com.google.common.**
