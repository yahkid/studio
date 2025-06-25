
package com.hscmconnect.app.models

import com.google.firebase.Timestamp

data class Event(
    val id: String = "",
    val title: String = "",
    val description: String? = null,
    val event_date: Timestamp = Timestamp.now(),
    val start_time: String = "",
    val end_time: String = "",
    val event_type: String = "special", // weekly, monthly, special
    val platform: String = "",
    val stream_url: String = "",
    val audience: String = "",
    val is_active: Boolean = true
)
