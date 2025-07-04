package com.hscmconnect.app.courses

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class CoursesViewModel : ViewModel() {

    private val db = FirebaseFirestore.getInstance()
    private val _courses = MutableLiveData<List<Course>>()
    val courses: LiveData<List<Course>> = _courses
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    init {
        fetchCourses()
    }

    private fun fetchCourses() {
        _isLoading.value = true
        db.collection("courses")
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val courseList = result.map { document ->
                    document.toObject(Course::class.java)
                }
                _courses.value = courseList
                _isLoading.value = false
            }
            .addOnFailureListener { 
                _isLoading.value = false
            }
    }
}
