
# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build types.
# For more information, see the ProGuard documentation:
# https://www.guardsquare.com/manual/configuration/usage

# If you are using Glide, you may need to add the following rules:
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$ImageType {
  **[] $VALUES;
  public *;
}

# If you use Gson with models that are obfuscated, you might need:
# -keep class com.google.gson.annotations.SerializedName
# -keep @com.google.gson.annotations.SerializedName class * {*;}
