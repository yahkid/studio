
package com.holyspiritconnect.hscapp.events

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.core.view.isVisible
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R

class EventsFragment : Fragment() {

    private val viewModel: EventsViewModel by viewModels()
    private lateinit var eventsAdapter: EventsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_events, container, false)
        val recyclerView: RecyclerView = view.findViewById(R.id.eventsRecyclerView)
        val progressBar: ProgressBar = view.findViewById(R.id.progressBar)

        eventsAdapter = EventsAdapter(requireContext(), emptyList())
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = eventsAdapter

        viewModel.events.observe(viewLifecycleOwner) { events ->
            eventsAdapter.updateEvents(events)
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.isVisible = isLoading
        }

        return view
    }
}
