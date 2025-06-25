
package com.hscmconnect.app.courses

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.hscmconnect.app.R

class CoursesFragment : Fragment() {

    private lateinit var coursesRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var coursesViewModel: CoursesViewModel
    private lateinit var adapter: CoursesAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_courses, container, false)
        coursesRecyclerView = view.findViewById(R.id.coursesRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        coursesRecyclerView.layoutManager = LinearLayoutManager(context)
        adapter = CoursesAdapter(emptyList())
        coursesRecyclerView.adapter = adapter
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        coursesViewModel = ViewModelProvider(this).get(CoursesViewModel::class.java)

        coursesViewModel.courses.observe(viewLifecycleOwner) { courses ->
            adapter.updateCourses(courses)
        }

        coursesViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
    }
}

class CoursesViewModel : ViewModel() {
    private val _courses = MutableLiveData<List<Course>>()
    val courses: LiveData<List<Course>> = _courses

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val db = FirebaseFirestore.getInstance()

    init {
        loadCourses()
    }

    private fun loadCourses() {
        _isLoading.value = true
        db.collection("courses")
            .whereEqualTo("is_published", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { documents ->
                val courseList = ArrayList<Course>()
                for (document in documents) {
                    val course = document.toObject(Course::class.java)
                    course.id = document.id
                    courseList.add(course)
                }
                _courses.value = courseList
                _isLoading.value = false
            }
            .addOnFailureListener {
                _isLoading.value = false
            }
    }
}

class CoursesAdapter(private var courses: List<Course>) : RecyclerView.Adapter<CoursesAdapter.CourseViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_course, parent, false)
        return CourseViewHolder(view)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.bind(course)
    }

    override fun getItemCount(): Int = courses.size

    fun updateCourses(newCourses: List<Course>) {
        this.courses = newCourses
        notifyDataSetChanged()
    }

    class CourseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val titleTextView: TextView = itemView.findViewById(R.id.courseTitle)
        private val instructorTextView: TextView = itemView.findViewById(R.id.courseInstructor)
        private val lessonCountTextView: TextView = itemView.findViewById(R.id.courseLessonCount)
        private val thumbnailImageView: ImageView = itemView.findViewById(R.id.courseThumbnail)

        fun bind(course: Course) {
            titleTextView.text = course.title
            instructorTextView.text = course.instructor
            lessonCountTextView.text = "${course.lessons.size} Lessons"
            Glide.with(itemView.context)
                .load(course.image_url)
                .into(thumbnailImageView)
        }
    }
}
