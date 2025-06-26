
package com.holyspiritconnect.hscapp.viewmodels

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.holyspiritconnect.hscapp.models.Event
import com.holyspiritconnect.hscapp.models.Sermon
import java.util.Date

class HomeViewModel(application: Application) : AndroidViewModel(application) {

    private val db = FirebaseFirestore.getInstance()

    private val _featuredSermon = MutableLiveData<Sermon?>()
    val featuredSermon: LiveData<Sermon?> = _featuredSermon

    private val _upcomingEvent = MutableLiveData<Event?>()
    val upcomingEvent: LiveData<Event?> = _upcomingEvent

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        fetchHomePageData()
    }

    private fun fetchHomePageData() {
        _isLoading.value = true
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
                if (!documents.isEmpty) {
                    val document = documents.documents[0]
                    val sermon = document.toObject(Sermon::class.java)?.copy(id = document.id)
                    _featuredSermon.value = sermon
                } else {
                    _featuredSermon.value = null
                }
                checkIfLoadingComplete()
            }
            .addOnFailureListener {
                _featuredSermon.value = null
                 checkIfLoadingComplete()
            }
    }

    private fun fetchUpcomingEvent() {
        db.collection("events")
            .whereEqualTo("is_active", true)
            .whereGreaterThanOrEqualTo("event_date", Date())
            .orderBy("event_date", Query.Direction.ASCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (!documents.isEmpty) {
                    val document = documents.documents[0]
                    val event = document.toObject(Event::class.java)?.copy(id = document.id)
                    _upcomingEvent.value = event
                } else {
                    _upcomingEvent.value = null
                }
                checkIfLoadingComplete()
            }
            .addOnFailureListener {
                _upcomingEvent.value = null
                checkIfLoadingComplete()
            }
    }
    
    private fun checkIfLoadingComplete() {
        // This is a simple way to determine loading state. For more complex scenarios
        // with more fetches, you might use a counter or more sophisticated state management.
        if (_featuredSermon.value !== null || _upcomingEvent.value !== null ||
            _featuredSermon.value == null && _upcomingEvent.value == null) {
            _isLoading.value = false
        }
    }
}
