package com.hscmconnect.app.courses

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R

class CourseDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_COURSE = "extra_course"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val course = intent.getParcelableExtra<Course>(EXTRA_COURSE)

        if (course != null) {
            val courseDetailImage: ImageView = findViewById(R.id.courseDetailImage)
            val courseDetailTitle: TextView = findViewById(R.id.courseDetailTitle)
            val courseDetailInstructor: TextView = findViewById(R.id.courseDetailInstructor)
            val courseDetailDescription: TextView = findViewById(R.id.courseDetailDescription)
            val lessonsRecyclerView: RecyclerView = findViewById(R.id.lessonsRecyclerView)

            courseDetailTitle.text = course.title
            courseDetailInstructor.text = course.instructor
            courseDetailDescription.text = course.description
            Glide.with(this).load(course.image_url).into(courseDetailImage)

            lessonsRecyclerView.layoutManager = LinearLayoutManager(this)
            lessonsRecyclerView.adapter = LessonAdapter(course.lessons)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
