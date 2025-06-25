package com.holyspiritconnect.hscapp.courses

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course

class CourseAdapter(
    private var courses: List<Course>,
    private val onItemClick: (Course) -> Unit
) : RecyclerView.Adapter<CourseAdapter.CourseViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_course, parent, false)
        return CourseViewHolder(view)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.bind(course)
    }

    override fun getItemCount(): Int = courses.size

    fun updateData(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }

    inner class CourseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val thumbnail: ImageView = itemView.findViewById(R.id.courseThumbnail)
        private val title: TextView = itemView.findViewById(R.id.courseTitle)
        private val instructor: TextView = itemView.findViewById(R.id.courseInstructor)
        private val lessonCount: TextView = itemView.findViewById(R.id.courseLessonCount)

        fun bind(course: Course) {
            title.text = course.title
            instructor.text = course.instructor
            lessonCount.text = itemView.context.resources.getString(R.string.course_lessons_count, course.lessons.size)

            Glide.with(itemView.context)
                .load(course.imageUrl)
                .centerCrop()
                .placeholder(R.drawable.ic_courses_24)
                .into(thumbnail)

            itemView.setOnClickListener {
                onItemClick(course)
            }
        }
    }
}
