package com.hscmconnect.app.model

import android.os.Parcelable
import com.google.firebase.Timestamp
import kotlinx.parcelize.Parcelize
import kotlinx.parcelize.RawValue

@Parcelize
data class Sermon(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val speaker: String = "",
    val youtube_video_id: String = "",
    // Use @RawValue for non-parcelable types like Timestamp
    val sermon_date: @RawValue Timestamp = Timestamp.now(),
    val is_featured: Boolean = false
) : Parcelable
