package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.google.firebase.firestore.PropertyName
import kotlinx.parcelize.Parcelize

@Parcelize
data class Course(
    val id: String = "",
    val title: String = "",
    val description: String = "",
    val instructor: String = "",
    @get:PropertyName("image_url") @set:PropertyName("image_url") var imageUrl: String = "",
    val lessons: List<Lesson> = emptyList(),
    val order: Int = 0
) : Parcelable
