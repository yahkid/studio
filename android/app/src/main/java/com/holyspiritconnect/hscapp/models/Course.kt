
package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Lesson(
    val id: Long = 0,
    val title: String = "",
    val videoId: String = "",
    val duration: String = "",
    val description: String? = null,
    val pdfDownloadUrl: String? = null
) : Parcelable

@Parcelize
data class Course(
    @get:JvmField var id: String = "",
    var course_slug: String = "",
    var title: String = "",
    var instructor: String = "",
    var description: String = "",
    var image_url: String = "",
    var lessons: List<Lesson> = emptyList(),
    @get:JvmField var is_published: Boolean = false,
    var order: Long = 0
) : Parcelable
