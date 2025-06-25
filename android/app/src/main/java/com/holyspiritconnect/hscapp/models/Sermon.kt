
package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.google.firebase.firestore.ServerTimestamp
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Sermon(
    @get:JvmField var id: String = "",
    var title: String = "",
    var speaker: String = "",
    var description: String = "",
    @ServerTimestamp var sermon_date: Date? = null,
    var youtube_video_id: String = "",
    var audioDownloadUrl: String? = null,
    var videoDownloadUrl: String? = null,
    @get:JvmField var is_featured: Boolean = false,
    var tags: List<String>? = null
) : Parcelable
