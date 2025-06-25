
package com.hscmconnect.app.events

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class EventsFragment : Fragment() {

    private lateinit var eventsViewModel: EventsViewModel
    private lateinit var eventsRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var adapter: EventsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_events, container, false)

        eventsRecyclerView = view.findViewById(R.id.eventsRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        eventsRecyclerView.layoutManager = LinearLayoutManager(context)
        adapter = EventsAdapter(emptyList())
        eventsRecyclerView.adapter = adapter

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        eventsViewModel = ViewModelProvider(this).get(EventsViewModel::class.java)

        eventsViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        eventsViewModel.events.observe(viewLifecycleOwner) { events ->
            adapter.updateEvents(events)
        }

        eventsViewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(context, it, Toast.LENGTH_LONG).show()
            }
        }
    }
}
