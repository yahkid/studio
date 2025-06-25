package com.hscmconnect.app.courses

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase

class CoursesViewModel : ViewModel() {

    private val db = Firebase.firestore
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
            .whereEqualTo("is_published", true)
            .orderBy("order")
            .get()
            .addOnSuccessListener { result ->
                val courseList = result.map { document ->
                    val course = document.toObject(Course::class.java)
                    course.copy(id = document.id)
                }
                _courses.value = courseList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                // Handle the error
                _isLoading.value = false
            }
    }
}
