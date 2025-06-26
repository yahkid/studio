package com.holyspiritconnect.hscapp.models

import android.os.Parcelable
import com.google.firebase.firestore.IgnoreExtraProperties
import kotlinx.parcelize.Parcelize

@IgnoreExtraProperties
@Parcelize
data class Leadership(
    val name: String = "",
    val title: String = "",
    val bio: String = "",
    val imageSrc: String = "",
    val order: Int = 0
) : Parcelable
