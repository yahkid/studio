package com.hscmconnect.app.events

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class EventsViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private val _events = MutableLiveData<List<Event>>()
    val events: LiveData<List<Event>> = _events
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        fetchEvents()
    }

    private fun fetchEvents() {
        _isLoading.value = true
        db.collection("events")
            .orderBy("event_date", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val eventList = result.map { document ->
                    val event = document.toObject(Event::class.java)
                    event.id = document.id
                    event
                }
                _events.value = eventList
                _isLoading.value = false
            }
            .addOnFailureListener { 
                _isLoading.value = false
            }
    }
}
