package com.holyspiritconnect.hscapp.courses

import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course

class CourseDetailActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course_detail)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val course = intent.getParcelableExtra<Course>("COURSE_DATA")

        course?.let {
            title = it.title

            val imageView: ImageView = findViewById(R.id.courseDetailImage)
            val titleView: TextView = findViewById(R.id.courseDetailTitle)
            val instructorView: TextView = findViewById(R.id.courseDetailInstructor)
            val descriptionView: TextView = findViewById(R.id.courseDetailDescription)
            val lessonsRecyclerView: RecyclerView = findViewById(R.id.lessonsRecyclerView)

            titleView.text = it.title
            instructorView.text = it.instructor
            descriptionView.text = it.description

            Glide.with(this)
                .load(it.imageUrl)
                .placeholder(R.drawable.ic_courses_24)
                .into(imageView)

            lessonsRecyclerView.layoutManager = LinearLayoutManager(this)
            lessonsRecyclerView.adapter = LessonAdapter(it.lessons)
        }
    }
     override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
