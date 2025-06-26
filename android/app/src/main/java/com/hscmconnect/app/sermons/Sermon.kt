package com.hscmconnect.app.sermons

import android.os.Parcelable
import com.google.firebase.Timestamp
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Sermon(
    var id: String = "",
    val title: String = "",
    val description: String = "",
    val speaker: String = "",
    val youtube_video_id: String = "",
    val sermon_date: Date = Date(),
    val is_featured: Boolean = false
) : Parcelable
