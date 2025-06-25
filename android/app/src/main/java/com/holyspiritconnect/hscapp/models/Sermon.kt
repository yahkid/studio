package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.google.firebase.Timestamp
import kotlinx.parcelize.Parcelize
import java.text.SimpleDateFormat
import java.util.*

@Parcelize
data class Sermon(
    val id: String = "",
    val title: String = "",
    val speaker: String = "",
    val description: String = "",
    val youtube_video_id: String = "",
    val sermon_date: Timestamp = Timestamp.now(),
    val is_featured: Boolean = false
) : Parcelable {
    fun getFormattedDate(): String {
        val sdf = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
        return sdf.format(sermon_date.toDate())
    }

    fun getThumbnailUrl(): String {
        return "https://img.youtube.com/vi/$youtube_video_id/mqdefault.jpg"
    }
}
