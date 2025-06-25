
package com.hscmconnect.app.home

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.hscmconnect.app.event.Event
import com.hscmconnect.app.sermons.Sermon

class HomeViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()

    private val _featuredSermon = MutableLiveData<Sermon?>()
    val featuredSermon: LiveData<Sermon?> = _featuredSermon

    private val _upcomingEvent = MutableLiveData<Event?>()
    val upcomingEvent: LiveData<Event?> = _upcomingEvent

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private var sermonFetchCompleted = false
    private var eventFetchCompleted = false

    fun fetchHomeContent() {
        _isLoading.value = true
        sermonFetchCompleted = false
        eventFetchCompleted = false
        fetchFeaturedSermon()
        fetchUpcomingEvent()
    }

    private fun fetchFeaturedSermon() {
        db.collection("sermons")
            .whereEqualTo("is_featured", true)
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                _featuredSermon.value = if (!documents.isEmpty) {
                    val sermon = documents.documents[0].toObject(Sermon::class.java)
                    sermon?.id = documents.documents[0].id
                    sermon
                } else {
                    null
                }
                sermonFetchCompleted = true
                checkIfLoadingComplete()
            }
            .addOnFailureListener { exception ->
                _error.value = "Failed to load featured sermon: ${exception.message}"
                sermonFetchCompleted = true
                checkIfLoadingComplete()
            }
    }

    private fun fetchUpcomingEvent() {
        db.collection("events")
            .whereGreaterThanOrEqualTo("event_date", Timestamp.now())
            .orderBy("event_date", Query.Direction.ASCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                _upcomingEvent.value = if (!documents.isEmpty) {
                    val event = documents.documents[0].toObject(Event::class.java)
                    event?.id = documents.documents[0].id
                    event
                } else {
                    null
                }
                eventFetchCompleted = true
                checkIfLoadingComplete()
            }
            .addOnFailureListener { exception ->
                _error.value = "Failed to load upcoming event: ${exception.message}"
                eventFetchCompleted = true
                checkIfLoadingComplete()
            }
    }

    private fun checkIfLoadingComplete() {
        if (sermonFetchCompleted && eventFetchCompleted) {
            _isLoading.value = false
        }
    }
}
