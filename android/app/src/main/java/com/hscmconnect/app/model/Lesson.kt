package com.hscmconnect.app.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Lesson(
    val id: Int = 0,
    val title: String = "",
    val videoId: String = "",
    val duration: String = "",
    val description: String? = null
) : Parcelable
