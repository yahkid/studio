package com.hscmconnect.app.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Course(
    val id: String = "",
    val course_slug: String = "",
    val title: String = "",
    val description: String = "",
    val instructor: String = "",
    val image_url: String = "",
    val lessons: List<Lesson> = emptyList(),
    val is_published: Boolean = false,
    val order: Int = 0
) : Parcelable
