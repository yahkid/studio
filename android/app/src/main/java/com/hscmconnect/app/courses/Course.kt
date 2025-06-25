
package com.hscmconnect.app.courses

data class Course(
    var id: String = "",
    val title: String = "",
    val instructor: String = "",
    val image_url: String = "",
    val lessons: List<Lesson> = emptyList()
)

data class Lesson(
    val id: Long = 0,
    val title: String = "",
    val duration: String = ""
)
