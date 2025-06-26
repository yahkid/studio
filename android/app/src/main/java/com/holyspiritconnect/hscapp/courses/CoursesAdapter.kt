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

class CoursesAdapter(
    private var courses: List<Course>,
    private val onItemClicked: (Course) -> Unit
) : RecyclerView.Adapter<CoursesAdapter.CourseViewHolder>() {

    class CourseViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val thumbnail: ImageView = view.findViewById(R.id.courseThumbnail)
        val title: TextView = view.findViewById(R.id.courseTitle)
        val instructor: TextView = view.findViewById(R.id.courseInstructor)
        val lessonCount: TextView = view.findViewById(R.id.courseLessonCount)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_course, parent, false)
        return CourseViewHolder(view)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.title.text = course.title
        holder.instructor.text = course.instructor
        holder.lessonCount.text = holder.itemView.context.getString(R.string.course_lessons_count, course.lessons.size)

        Glide.with(holder.itemView.context)
            .load(course.imageUrl)
            .placeholder(R.drawable.ic_courses_24)
            .into(holder.thumbnail)

        holder.itemView.setOnClickListener {
            onItemClicked(course)
        }
    }

    override fun getItemCount() = courses.size

    fun updateData(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }
}
