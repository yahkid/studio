
package com.hscmconnect.app.sermons

import com.google.firebase.Timestamp
import com.google.firebase.firestore.ServerTimestamp

data class Sermon(
    val id: String = "",
    val title: String = "",
    val speaker: String = "",
    val description: String = "",
    val youtube_video_id: String = "",
    @ServerTimestamp val sermon_date: Timestamp? = null
)
