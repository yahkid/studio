package com.holyspiritconnect.hscapp.courses

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
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
import com.holyspiritconnect.hscapp.databinding.FragmentCoursesBinding
import com.holyspiritconnect.hscapp.databinding.ItemCourseBinding
import com.holyspiritconnect.hscapp.models.Course
import com.holyspiritconnect.hscapp.models.Lesson

class CoursesFragment : Fragment() {

    private var _binding: FragmentCoursesBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: CoursesViewModel
    private lateinit var coursesAdapter: CoursesAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCoursesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[CoursesViewModel::class.java]

        setupRecyclerView()

        binding.progressBar.visibility = View.VISIBLE
        viewModel.courses.observe(viewLifecycleOwner) { courses ->
            coursesAdapter.submitList(courses)
            binding.progressBar.visibility = View.GONE
        }
    }

    private fun setupRecyclerView() {
        coursesAdapter = CoursesAdapter()
        binding.coursesRecyclerView.apply {
            adapter = coursesAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

class CoursesViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()
    private val _courses = MutableLiveData<List<Course>>()
    val courses: LiveData<List<Course>> = _courses

    init {
        fetchCourses()
    }

    @Suppress("UNCHECKED_CAST")
    private fun fetchCourses() {
        db.collection("courses")
            .whereEqualTo("is_published", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val courseList = result.map { document ->
                    val data = document.data
                    val lessonsList = (data["lessons"] as? List<Map<String, Any>>)?.map { lessonMap ->
                        Lesson(
                            id = (lessonMap["id"] as? Long)?.toInt() ?: 0,
                            title = lessonMap["title"] as? String ?: "",
                            videoId = lessonMap["videoId"] as? String ?: "",
                            duration = lessonMap["duration"] as? String ?: "",
                            description = lessonMap["description"] as? String ?: ""
                        )
                    } ?: emptyList()

                    Course(
                        id = document.id,
                        title = data["title"] as? String ?: "",
                        instructor = data["instructor"] as? String ?: "",
                        description = data["description"] as? String ?: "",
                        image_url = data["image_url"] as? String ?: "",
                        lessons = lessonsList
                    )
                }
                _courses.value = courseList
            }
            .addOnFailureListener {
                // Handle the error, e.g., post an error state to LiveData
            }
    }
}

class CoursesAdapter : RecyclerView.Adapter<CoursesAdapter.CourseViewHolder>() {
    private var courses: List<Course> = emptyList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CourseViewHolder {
        val binding = ItemCourseBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CourseViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CourseViewHolder, position: Int) {
        val course = courses[position]
        holder.bind(course)
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, CourseDetailActivity::class.java).apply {
                putExtra("course", course)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = courses.size

    fun submitList(newCourses: List<Course>) {
        courses = newCourses
        notifyDataSetChanged()
    }

    class CourseViewHolder(private val binding: ItemCourseBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(course: Course) {
            binding.courseTitle.text = course.title
            binding.courseInstructor.text = course.instructor
            binding.courseLessonCount.text = course.getLessonCountString(itemView.context)
            Glide.with(itemView.context).load(course.image_url).into(binding.courseThumbnail)
        }
    }
}
