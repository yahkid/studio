
package com.holyspiritconnect.hscapp.sermons

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.holyspiritconnect.hscapp.models.Sermon

class SermonsViewModel : ViewModel() {
    private val db = Firebase.firestore

    private val _sermons = MutableLiveData<List<Sermon>>()
    val sermons: LiveData<List<Sermon>> = _sermons

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    init {
        fetchSermons()
    }

    private fun fetchSermons() {
        _isLoading.value = true
        db.collection("sermons")
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { documents ->
                val sermonList = documents.map { document ->
                    val sermon = document.toObject(Sermon::class.java)
                    sermon.id = document.id
                    sermon
                }
                _sermons.value = sermonList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                _error.value = "Error getting documents: ${exception.message}"
                _isLoading.value = false
            }
    }
}
