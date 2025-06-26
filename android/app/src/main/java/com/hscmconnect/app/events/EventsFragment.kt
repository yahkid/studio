package com.hscmconnect.app.events

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

class EventsFragment : Fragment() {

    private lateinit var eventsRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var eventsAdapter: EventsAdapter
    private val viewModel: EventsViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_events, container, false)
        eventsRecyclerView = view.findViewById(R.id.eventsRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        
        setupRecyclerView()

        viewModel.events.observe(viewLifecycleOwner, Observer { events ->
            eventsAdapter.updateEvents(events)
        })
        
        viewModel.isLoading.observe(viewLifecycleOwner, Observer { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        })

        return view
    }

    private fun setupRecyclerView() {
        eventsAdapter = EventsAdapter(emptyList())
        eventsRecyclerView.layoutManager = LinearLayoutManager(context)
        eventsRecyclerView.adapter = eventsAdapter
    }
}
