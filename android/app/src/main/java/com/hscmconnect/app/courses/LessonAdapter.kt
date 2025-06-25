package com.hscmconnect.app.courses

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R
import com.hscmconnect.app.model.Lesson

class LessonAdapter(
    private var lessons: List<Lesson>,
    private val onLessonClickListener: (Lesson) -> Unit
) : RecyclerView.Adapter<LessonAdapter.LessonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LessonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_lesson, parent, false)
        return LessonViewHolder(view)
    }

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int) {
        val lesson = lessons[position]
        holder.bind(lesson, position + 1)
        holder.itemView.setOnClickListener {
            onLessonClickListener(lesson)
        }
    }

    override fun getItemCount(): Int = lessons.size

    fun updateData(newLessons: List<Lesson>) {
        lessons = newLessons
        notifyDataSetChanged()
    }

    class LessonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val lessonNumber: TextView = itemView.findViewById(R.id.lessonNumber)
        private val lessonTitle: TextView = itemView.findViewById(R.id.lessonTitle)
        private val lessonDuration: TextView = itemView.findViewById(R.id.lessonDuration)

        fun bind(lesson: Lesson, position: Int) {
            lessonNumber.text = "Lesson $position"
            lessonTitle.text = lesson.title
            lessonDuration.text = lesson.duration
        }
    }
}
