# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to all build types.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html
#
# You can find general ProGuard rules for popular libraries at
#   https://github.com/firebase/firebase-android-sdk/blob/master/firebase-app/proguard.txt

# Add any project specific keep rules here:
#
# If you use reflection to access classes in shrinking code, you have to
# specify that code here.
#-keep class com.google.vending.licensing.ILicensingService
-keep class com.bumptech.glide.GeneratedAppGlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public class * extends com.bumptech.glide.module.LibraryGlideModule
