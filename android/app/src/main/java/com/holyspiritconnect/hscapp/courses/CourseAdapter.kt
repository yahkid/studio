
package com.holyspiritconnect.hscapp.courses

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course

class CourseAdapter(private var courses: List<Course>) : RecyclerView.Adapter<CourseAdapter.CourseViewHolder>() {

    class CourseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val thumbnail: ImageView = itemView.findViewById(R.id.courseThumbnail)
        val title: TextView = itemView.findViewById(R.id.courseTitle)
        val instructor: TextView = itemView.findViewById(R.id.courseInstructor)
        val lessonCount: TextView = itemView.findViewById(R.id.courseLessonCount)
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
        holder.lessonCount.text = "${course.lessons.size} Lessons"
        Glide.with(holder.itemView.context).load(course.image_url).into(holder.thumbnail)
        
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, CourseDetailActivity::class.java).apply {
                putExtra(CourseDetailActivity.EXTRA_COURSE, course)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount() = courses.size

    fun updateData(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }
}
