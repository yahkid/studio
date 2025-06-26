package com.hscmconnect.app.leadership

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class LeadershipViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()
    private val _leaders = MutableLiveData<List<Leadership>>()
    val leaders: LiveData<List<Leadership>> = _leaders

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        fetchLeaders()
    }

    private fun fetchLeaders() {
        _isLoading.value = true
        db.collection("leadership")
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val leaderList = result.documents.mapNotNull { document ->
                    val leader = document.toObject(Leadership::class.java)
                    leader?.id = document.id
                    leader
                }
                _leaders.value = leaderList
                _isLoading.value = false
            }
            .addOnFailureListener {
                _isLoading.value = false
            }
    }
}
