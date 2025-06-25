package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.google.firebase.Timestamp
import kotlinx.parcelize.Parcelize
import java.text.SimpleDateFormat
import java.util.*

@Parcelize
data class Event(
    val id: String = "",
    val title: String = "",
    val description: String? = null,
    val event_date: Timestamp = Timestamp.now(),
    val start_time: String = "",
    val end_time: String? = null,
    val event_type: String = "special",
    val platform: String = "",
    val audience: String = ""
) : Parcelable {
    fun getFormattedDate(): String {
        val sdf = SimpleDateFormat("EEEE, MMMM d, yyyy", Locale.getDefault())
        return sdf.format(event_date.toDate())
    }

    fun getFormattedTime(): String {
        return if (end_time != null) {
            "$start_time - $end_time"
        } else {
            start_time
        }
    }
}
