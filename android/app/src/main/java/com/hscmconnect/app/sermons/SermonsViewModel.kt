package com.hscmconnect.app.sermons

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class SermonsViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private val _sermons = MutableLiveData<List<Sermon>>()
    val sermons: LiveData<List<Sermon>> = _sermons
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        fetchSermons()
    }

    private fun fetchSermons() {
        _isLoading.value = true
        db.collection("sermons")
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { result ->
                val sermonList = result.documents.mapNotNull { document ->
                    val sermon = document.toObject(Sermon::class.java)
                    sermon?.id = document.id
                    sermon
                }
                _sermons.value = sermonList
                _isLoading.value = false
            }
            .addOnFailureListener { 
                _isLoading.value = false
            }
    }
}
