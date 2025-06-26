package com.hscmconnect.app.courses

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class LessonAdapter(private val lessons: List<Lesson>) :
    RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LessonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_lesson, parent, false)
        return LessonViewHolder(view)
    }

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int) {
        val lesson = lessons[position]
        holder.bind(lesson, position + 1)
    }

    override fun getItemCount() = lessons.size

    class LessonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val lessonNumber: TextView = itemView.findViewById(R.id.lessonNumber)
        private val lessonTitle: TextView = itemView.findViewById(R.id.lessonTitle)
        private val lessonDuration: TextView = itemView.findViewById(R.id.lessonDuration)

        fun bind(lesson: Lesson, number: Int) {
            lessonNumber.text = itemView.context.getString(R.string.lesson_number, number)
            lessonTitle.text = lesson.title
            lessonDuration.text = lesson.duration
        }
    }
}
