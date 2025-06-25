package com.holyspiritconnect.hscapp.courses

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course

class CoursesFragment : Fragment() {

    private lateinit var coursesViewModel: CoursesViewModel
    private lateinit var coursesAdapter: CourseAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_courses, container, false)

        recyclerView = view.findViewById(R.id.coursesRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)

        recyclerView.layoutManager = LinearLayoutManager(context)
        coursesAdapter = CourseAdapter(emptyList()) { course ->
            onCourseClicked(course)
        }
        recyclerView.adapter = coursesAdapter

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        coursesViewModel = ViewModelProvider(this).get(CoursesViewModel::class.java)

        coursesViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        coursesViewModel.courses.observe(viewLifecycleOwner) { courses ->
            coursesAdapter.updateData(courses)
        }

        coursesViewModel.fetchCourses()
    }

    private fun onCourseClicked(course: Course) {
        val intent = Intent(activity, CourseDetailActivity::class.java)
        intent.putExtra(CourseDetailActivity.EXTRA_COURSE, course)
        startActivity(intent)
    }
}
