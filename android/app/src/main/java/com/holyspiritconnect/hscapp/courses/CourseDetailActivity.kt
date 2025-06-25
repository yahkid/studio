package com.holyspiritconnect.hscapp.courses

import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course
import com.holyspiritconnect.hscapp.models.Lesson

class CourseDetailActivity : AppCompatActivity() {

    private lateinit var lessonsAdapter: LessonsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val course = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra(EXTRA_COURSE, Course::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra(EXTRA_COURSE)
        }

        if (course != null) {
            populateUI(course)
        } else {
            Toast.makeText(this, "Error: Course data not found.", Toast.LENGTH_LONG).show()
            finish()
        }
    }

    private fun populateUI(course: Course) {
        val imageView: ImageView = findViewById(R.id.courseDetailImage)
        val titleView: TextView = findViewById(R.id.courseDetailTitle)
        val instructorView: TextView = findViewById(R.id.courseDetailInstructor)
        val descriptionView: TextView = findViewById(R.id.courseDetailDescription)
        val lessonsRecyclerView: RecyclerView = findViewById(R.id.lessonsRecyclerView)

        titleView.text = course.title
        instructorView.text = course.instructor
        descriptionView.text = course.description

        Glide.with(this)
            .load(course.imageUrl)
            .centerCrop()
            .into(imageView)

        lessonsAdapter = LessonsAdapter(course.lessons) { lesson ->
            onLessonClicked(lesson)
        }
        lessonsRecyclerView.layoutManager = LinearLayoutManager(this)
        lessonsRecyclerView.adapter = lessonsAdapter
    }

    private fun onLessonClicked(lesson: Lesson) {
        // In a real app, you would open the video player here
        Toast.makeText(this, "Playing: ${lesson.title}", Toast.LENGTH_SHORT).show()
    }


    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }

    companion object {
        const val EXTRA_COURSE = "EXTRA_COURSE"
    }
}
