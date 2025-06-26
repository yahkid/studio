package com.holyspiritconnect.hscapp.courses

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Lesson

class LessonAdapter(private val lessons: List<Lesson>) :
    RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    class LessonViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val lessonNumber: TextView = view.findViewById(R.id.lessonNumber)
        val lessonTitle: TextView = view.findViewById(R.id.lessonTitle)
        val lessonDuration: TextView = view.findViewById(R.id.lessonDuration)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LessonViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_lesson, parent, false)
        return LessonViewHolder(view)
    }

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int) {
        val lesson = lessons[position]
        holder.lessonNumber.text = holder.itemView.context.getString(R.string.lesson_number, position + 1)
        holder.lessonTitle.text = lesson.title
        holder.lessonDuration.text = lesson.duration
    }

    override fun getItemCount() = lessons.size
}
