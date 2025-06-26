package com.hscmconnect.app.courses

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class CoursesFragment : Fragment(), CourseAdapter.OnItemClickListener {

    private lateinit var coursesRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var courseAdapter: CourseAdapter
    private val viewModel: CoursesViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_courses, container, false)
        coursesRecyclerView = view.findViewById(R.id.coursesRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        
        setupRecyclerView()

        viewModel.courses.observe(viewLifecycleOwner, Observer { courses ->
            courseAdapter.updateCourses(courses)
            progressBar.visibility = View.GONE
        })
        
        viewModel.isLoading.observe(viewLifecycleOwner, Observer { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        })

        return view
    }

    private fun setupRecyclerView() {
        courseAdapter = CourseAdapter(emptyList(), this)
        coursesRecyclerView.layoutManager = LinearLayoutManager(context)
        coursesRecyclerView.adapter = courseAdapter
    }

    override fun onItemClick(course: Course) {
        val intent = Intent(activity, CourseDetailActivity::class.java)
        intent.putExtra(CourseDetailActivity.EXTRA_COURSE, course)
        startActivity(intent)
    }
}
