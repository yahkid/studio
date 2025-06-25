
package com.hscmconnect.app.events

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.Timestamp
import com.hscmconnect.app.models.Event

class EventsViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()

    private val _events = MutableLiveData<List<Event>>()
    val events: LiveData<List<Event>> = _events

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        fetchEvents()
    }

    fun fetchEvents() {
        _isLoading.value = true
        db.collection("events")
            .whereEqualTo("is_active", true)
            .whereGreaterThanOrEqualTo("event_date", Timestamp.now()) // Fetch only future events
            .orderBy("event_date", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val eventList = result.documents.map { document ->
                    val event = document.toObject(Event::class.java)
                    event?.copy(id = document.id) ?: Event()
                }
                _events.value = eventList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                _error.value = "Error fetching events: ${exception.message}"
                _isLoading.value = false
            }
    }
}
