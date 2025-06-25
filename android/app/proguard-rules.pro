# Add project specific ProGuard rules here.
# By default, the flags in this file are applied to recesses of your
# project.
#
# You can find general ProGuard rules for popular libraries at
# https://www.guardsquare.com/proguard/manual/examples
#
# If you are using Kotlin coroutines, be sure to include the following rules:
# -keepnames class kotlinx.coroutines.internal.MainDispatcherFactory { *; }
# -keepnames class kotlinx.coroutines.flow.internal.ChannelFlow { *; }
# -keepnames class kotlinx.coroutines.flow.internal.ChannelFlow* { *; }
# -keepclassmembers class kotlinx.coroutines.flow.internal.ChannelFlow* {
#   private final kotlinx.coroutines.channels.ReceiveChannel channel;
# }
# -keepclassmembers class kotlinx.coroutines.selects.SelectBuilderImpl {
#   private final java.util.List clauses;
# }
# -keepclassmembers class kotlinx.coroutines.internal.Segment {
#   private final java.util.concurrent.atomic.AtomicReferenceArray data;
# }
# -keepclassmembers class kotlinx.coroutines.internal.FastServiceLoader {
#   private final java.util.List a;
# }
