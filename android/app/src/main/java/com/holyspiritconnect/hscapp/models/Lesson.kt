package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Lesson(
    val id: Long = 0,
    val title: String = "",
    val duration: String = "",
    val videoId: String = "",
    val description: String? = null,
    val pdfDownloadUrl: String? = null
) : Parcelable
