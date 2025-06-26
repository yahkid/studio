package com.hscmconnect.app.leadership

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Leadership(
    val id: String = "",
    val name: String = "",
    val title: String = "",
    val imageSrc: String = "",
    val bio: String = "",
    val order: Int = 0
) : Parcelable
