package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.holyspiritconnect.hscapp.R
import kotlinx.parcelize.Parcelize

@Parcelize
data class Course(
    val id: String = "",
    val title: String = "",
    val instructor: String = "",
    val description: String = "",
    val image_url: String = "",
    val lessons: List<Lesson> = emptyList()
) : Parcelable {
    fun getLessonCountString(context: android.content.Context): String {
        return context.resources.getString(R.string.course_lessons_count, lessons.size)
    }
}


@Parcelize
data class Lesson(
    val id: Int = 0,
    val title: String = "",
    val videoId: String = "",
    val duration: String = "",
    val description: String? = null
) : Parcelable
