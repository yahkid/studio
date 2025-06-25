package com.holyspiritconnect.hscapp.courses

import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.databinding.ActivityCourseDetailBinding
import com.holyspiritconnect.hscapp.databinding.ItemLessonBinding
import com.holyspiritconnect.hscapp.models.Course
import com.holyspiritconnect.hscapp.models.Lesson

class CourseDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCourseDetailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCourseDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val course = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra("course", Course::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra("course")
        }

        course?.let {
            supportActionBar?.title = it.title
            binding.courseDetailTitle.text = it.title
            binding.courseDetailInstructor.text = it.instructor
            binding.courseDetailDescription.text = it.description
            Glide.with(this).load(it.image_url).into(binding.courseDetailImage)

            binding.lessonsRecyclerView.apply {
                layoutManager = LinearLayoutManager(this@CourseDetailActivity)
                adapter = LessonsAdapter(it.lessons)
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}

class LessonsAdapter(private val lessons: List<Lesson>) :
    RecyclerView.Adapter<LessonsAdapter.LessonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LessonViewHolder {
        val binding = ItemLessonBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LessonViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LessonViewHolder, position: Int) {
        holder.bind(lessons[position], position + 1)
    }

    override fun getItemCount(): Int = lessons.size

    class LessonViewHolder(private val binding: ItemLessonBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(lesson: Lesson, lessonNumber: Int) {
            binding.lessonNumber.text = itemView.context.getString(R.string.lesson_number, lessonNumber)
            binding.lessonTitle.text = lesson.title
            binding.lessonDuration.text = lesson.duration
        }
    }
}
