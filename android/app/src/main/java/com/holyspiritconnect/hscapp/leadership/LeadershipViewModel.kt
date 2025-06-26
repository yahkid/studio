package com.holyspiritconnect.hscapp.leadership

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.holyspiritconnect.hscapp.models.Leadership

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
                val leadershipList = result.map { document ->
                    document.toObject(Leadership::class.java)
                }
                _leaders.value = leadershipList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                _isLoading.value = false
                // Handle the error, e.g., post an error state to the UI
            }
    }
}
