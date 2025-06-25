package com.holyspiritconnect.hscapp

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ktx.toObject
import com.holyspiritconnect.hscapp.models.Event
import com.holyspiritconnect.hscapp.models.Sermon
import com.google.firebase.Timestamp

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

    fun fetchHomeContent() {
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
                    val sermon = documents.documents[0].toObject<Sermon>()?.apply {
                        id = documents.documents[0].id
                    }
                    _featuredSermon.value = sermon
                } else {
                    _featuredSermon.value = null
                }
                checkLoadingState()
            }
            .addOnFailureListener { exception ->
                _error.value = "Failed to load featured sermon: ${exception.message}"
                _featuredSermon.value = null
                checkLoadingState()
            }
    }

    private fun fetchUpcomingEvent() {
        db.collection("events")
            .whereEqualTo("is_active", true)
            .whereGreaterThanOrEqualTo("event_date", Timestamp.now())
            .orderBy("event_date", Query.Direction.ASCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (!documents.isEmpty) {
                    val event = documents.documents[0].toObject<Event>()?.apply {
                        id = documents.documents[0].id
                    }
                    _upcomingEvent.value = event
                } else {
                    _upcomingEvent.value = null
                }
                checkLoadingState()
            }
            .addOnFailureListener { exception ->
                 _error.value = "Failed to load upcoming event: ${exception.message}"
                _upcomingEvent.value = null
                checkLoadingState()
            }
    }

    private fun checkLoadingState() {
        if (_featuredSermon.value !== null || _upcomingEvent.value !== null || _error.value != null) {
            // A small delay to allow both requests to potentially finish
            // This is a simple way to handle two parallel requests.
            // A more complex implementation might use Coroutines or Task combinations.
            android.os.Handler().postDelayed({
                _isLoading.value = false
            }, 500)
        }
    }
}
