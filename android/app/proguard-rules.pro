# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build types.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If you are using Google Play Services, you may need to add the following
# lines to your ProGuard configuration file.
-keep class com.google.android.gms.common.api.internal.IStatusCallback { *; }

# If you're using Glide, you may want to add the following to prevent issues with obfuscation:
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$ImageType {
  **[] $VALUES;
  public *;
}
