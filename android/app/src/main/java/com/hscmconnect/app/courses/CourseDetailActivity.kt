package com.hscmconnect.app.courses

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R
import com.hscmconnect.app.model.Course

class CourseDetailActivity : AppCompatActivity() {

    private lateinit var courseDetailImage: ImageView
    private lateinit var courseDetailTitle: TextView
    private lateinit var courseDetailInstructor: TextView
    private lateinit var courseDetailDescription: TextView
    private lateinit var lessonsRecyclerView: RecyclerView

    private lateinit var lessonAdapter: LessonAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_course_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        courseDetailImage = findViewById(R.id.courseDetailImage)
        courseDetailTitle = findViewById(R.id.courseDetailTitle)
        courseDetailInstructor = findViewById(R.id.courseDetailInstructor)
        courseDetailDescription = findViewById(R.id.courseDetailDescription)
        lessonsRecyclerView = findViewById(R.id.lessonsRecyclerView)

        val course = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra("COURSE_EXTRA", Course::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra("COURSE_EXTRA")
        }

        if (course != null) {
            title = course.title
            courseDetailTitle.text = course.title
            courseDetailInstructor.text = course.instructor
            courseDetailDescription.text = course.description
            Glide.with(this)
                .load(course.image_url)
                .into(courseDetailImage)

            setupRecyclerView(course)
        }
    }
    
    private fun setupRecyclerView(course: Course) {
        lessonAdapter = LessonAdapter(course.lessons) { lesson ->
            // Open YouTube app or browser with the video
            val youtubeIntent = Intent(Intent.ACTION_VIEW, Uri.parse("vnd.youtube:${lesson.videoId}"))
            if (youtubeIntent.resolveActivity(packageManager) != null) {
                startActivity(youtubeIntent)
            } else {
                // Fallback to browser if YouTube app is not installed
                val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("http://www.youtube.com/watch?v=${lesson.videoId}"))
                startActivity(webIntent)
            }
        }
        lessonsRecyclerView.adapter = lessonAdapter
        lessonsRecyclerView.layoutManager = LinearLayoutManager(this)
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
