package com.hscmconnect.app.courses

import com.google.firebase.firestore.IgnoreExtraProperties

@IgnoreExtraProperties
data class Course(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val instructor: String = "",
    val image_url: String = "",
    val lessons: List<Lesson> = emptyList(),
    val order: Int = 0,
    val is_published: Boolean = false
)

@IgnoreExtraProperties
data class Lesson(
    val id: Int = 0,
    val title: String = "",
    val videoId: String = "",
    val duration: String = "",
    val description: String? = null
)
