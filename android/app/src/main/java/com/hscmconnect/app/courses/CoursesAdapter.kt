package com.hscmconnect.app.courses

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R
import com.hscmconnect.app.model.Course

class CoursesAdapter(private var courses: List<Course>) :
    RecyclerView.Adapter<CoursesAdapter.CourseViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_course, parent, false)
        return CourseViewHolder(view)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.bind(course)
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, CourseDetailActivity::class.java).apply {
                putExtra("COURSE_EXTRA", course)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = courses.size

    fun updateData(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }

    class CourseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val thumbnail: ImageView = itemView.findViewById(R.id.courseThumbnail)
        private val title: TextView = itemView.findViewById(R.id.courseTitle)
        private val instructor: TextView = itemView.findViewById(R.id.courseInstructor)
        private val lessonCount: TextView = itemView.findViewById(R.id.courseLessonCount)

        fun bind(course: Course) {
            title.text = course.title
            instructor.text = course.instructor
            lessonCount.text = "${course.lessons.size} Lessons"
            Glide.with(itemView.context)
                .load(course.image_url)
                .placeholder(R.drawable.ic_courses_24)
                .into(thumbnail)
        }
    }
}
