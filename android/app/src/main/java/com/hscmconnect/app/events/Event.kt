package com.hscmconnect.app.events

import android.os.Parcelable
import com.google.firebase.Timestamp
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Event(
    val id: String = "",
    val title: String = "",
    val description: String? = null,
    val date: Date = Date(),
    val start_time: String = "",
    val end_time: String = "",
    val event_type: String = "",
    val platform: String = "",
    val stream_url: String? = null,
    val audience: String = ""
) : Parcelable
