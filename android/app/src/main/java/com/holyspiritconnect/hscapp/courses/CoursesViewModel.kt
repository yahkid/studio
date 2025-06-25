package com.holyspiritconnect.hscapp.courses

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.holyspiritconnect.hscapp.models.Course
import com.holyspiritconnect.hscapp.models.Lesson

class CoursesViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()

    private val _courses = MutableLiveData<List<Course>>()
    val courses: LiveData<List<Course>> = _courses

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun fetchCourses() {
        _isLoading.value = true
        db.collection("courses")
            .whereEqualTo("is_published", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { documents ->
                val coursesList = documents.map { document ->
                    val lessonMaps = document.get("lessons") as? List<Map<String, Any>> ?: emptyList()
                    val lessons = lessonMaps.map { map ->
                        Lesson(
                            id = map["id"] as? Long ?: 0,
                            title = map["title"] as? String ?: "",
                            duration = map["duration"] as? String ?: "",
                            videoId = map["videoId"] as? String ?: "",
                            description = map["description"] as? String,
                            pdfDownloadUrl = map["pdfDownloadUrl"] as? String
                        )
                    }
                    Course(
                        id = document.id,
                        title = document.getString("title") ?: "",
                        description = document.getString("description") ?: "",
                        instructor = document.getString("instructor") ?: "",
                        imageUrl = document.getString("image_url") ?: "",
                        order = (document.getLong("order") ?: 0).toInt(),
                        lessons = lessons
                    )
                }
                _courses.value = coursesList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                _isLoading.value = false
                // Handle the error, e.g., show a toast
            }
    }
}
