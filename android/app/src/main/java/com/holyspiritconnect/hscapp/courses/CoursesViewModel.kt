package com.holyspiritconnect.hscapp.courses

import android.util.Log
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

    init {
        fetchCourses()
    }

    private fun fetchCourses() {
        _isLoading.value = true
        db.collection("courses")
            .whereEqualTo("is_published", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { documents ->
                val courseList = documents.map { document ->
                    val lessonsList = (document.get("lessons") as? List<Map<String, Any>>)?.map { lessonMap ->
                        Lesson(
                            id = (lessonMap["id"] as? Long)?.toInt() ?: 0,
                            title = lessonMap["title"] as? String ?: "",
                            videoId = lessonMap["videoId"] as? String ?: "",
                            duration = lessonMap["duration"] as? String ?: "",
                            description = lessonMap["description"] as? String,
                            pdfDownloadUrl = lessonMap["pdfDownloadUrl"] as? String
                        )
                    } ?: emptyList()

                    Course(
                        id = document.id,
                        title = document.getString("title") ?: "",
                        description = document.getString("description") ?: "",
                        instructor = document.getString("instructor") ?: "",
                        imageUrl = document.getString("image_url") ?: "",
                        lessons = lessonsList,
                        order = (document.getLong("order")?.toInt() ?: 0)
                    )
                }
                _courses.value = courseList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                Log.w("CoursesViewModel", "Error getting documents: ", exception)
                _isLoading.value = false
            }
    }
}
