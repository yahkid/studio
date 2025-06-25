
package com.hscmconnect.app.event

import com.google.firebase.Timestamp
import com.google.firebase.firestore.PropertyName

data class Event(
    var id: String = "",
    val title: String = "",
    @get:PropertyName("event_date") @set:PropertyName("event_date") var eventDate: Timestamp? = null,
    @get:PropertyName("start_time") @set:PropertyName("start_time") var startTime: String? = ""
)
