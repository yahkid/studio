
package com.hscmconnect.app.sermons

import com.google.firebase.Timestamp
import com.google.firebase.firestore.PropertyName

data class Sermon(
    var id: String = "",
    val title: String = "",
    val speaker: String = "",
    @get:PropertyName("youtube_video_id") @set:PropertyName("youtube_video_id") var youtubeVideoId: String = "",
    @get:PropertyName("sermon_date") @set:PropertyName("sermon_date") var sermonDate: Timestamp? = null,
    @get:PropertyName("is_featured") @set:PropertyName("is_featured") var isFeatured: Boolean = false
)
