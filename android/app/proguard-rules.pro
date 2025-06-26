# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build variants.
#
# You can find general ProGuard rules for popular libraries here:
# https://github.com/square/proguard-rules/tree/master/general

# Keep the Crashlytics and Performance Monitoring classes.
-keep class com.google.firebase.crashlytics.** { *; }
-keep class com.google.firebase.perf.** { *; }

# Add any other rules your app needs here. For example, for Glide:
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public class * extends com.bumptech.glide.module.LibraryGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$ImageType {
  **[] $VALUES;
  public *;
}
