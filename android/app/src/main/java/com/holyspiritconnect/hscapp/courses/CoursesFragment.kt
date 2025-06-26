package com.holyspiritconnect.hscapp.courses

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Course

class CoursesFragment : Fragment() {

    private lateinit var coursesViewModel: CoursesViewModel
    private lateinit var coursesAdapter: CoursesAdapter
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_courses, container, false)
        recyclerView = view.findViewById(R.id.coursesRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        recyclerView.layoutManager = LinearLayoutManager(context)
        coursesAdapter = CoursesAdapter(emptyList()) { course ->
            val intent = Intent(activity, CourseDetailActivity::class.java).apply {
                putExtra("COURSE_DATA", course)
            }
            startActivity(intent)
        }
        recyclerView.adapter = coursesAdapter

        coursesViewModel = ViewModelProvider(this)[CoursesViewModel::class.java]

        coursesViewModel.courses.observe(viewLifecycleOwner) { courses ->
            coursesAdapter.updateData(courses)
        }

        coursesViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
    }
}
