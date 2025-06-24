
package com.hscmconnect.app.sermons

import com.google.firebase.Timestamp

data class Sermon(
    val id: String = "",
    val title: String = "",
    val speaker: String = "",
    val youtube_video_id: String = "",
    val sermon_date: Timestamp? = null
)
