package com.hscmconnect.app.courses

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R

class CourseAdapter(private var courses: List<Course>, private val listener: OnItemClickListener) :
    RecyclerView.Adapter<CourseAdapter.CourseViewHolder>() {

    interface OnItemClickListener {
        fun onItemClick(course: Course)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_course, parent, false)
        return CourseViewHolder(view)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.bind(course)
    }

    override fun getItemCount() = courses.size

    fun updateCourses(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }

    inner class CourseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView), View.OnClickListener {
        private val courseThumbnail: ImageView = itemView.findViewById(R.id.courseThumbnail)
        private val courseTitle: TextView = itemView.findViewById(R.id.courseTitle)
        private val courseInstructor: TextView = itemView.findViewById(R.id.courseInstructor)
        private val courseLessonCount: TextView = itemView.findViewById(R.id.courseLessonCount)

        init {
            itemView.setOnClickListener(this)
        }

        fun bind(course: Course) {
            courseTitle.text = course.title
            courseInstructor.text = course.instructor
            courseLessonCount.text = "${course.lessons.size} Lessons"
            Glide.with(itemView.context).load(course.image_url).into(courseThumbnail)
        }

        override fun onClick(v: View?) {
            val position = adapterPosition
            if (position != RecyclerView.NO_POSITION) {
                listener.onItemClick(courses[position])
            }
        }
    }
}
