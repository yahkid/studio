package com.holyspiritconnect.hscapp.events

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
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.databinding.FragmentEventsBinding
import com.holyspiritconnect.hscapp.databinding.ItemEventBinding
import com.holyspiritconnect.hscapp.models.Event
import java.util.*

class EventsFragment : Fragment() {

    private var _binding: FragmentEventsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: EventsViewModel
    private lateinit var eventsAdapter: EventsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentEventsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[EventsViewModel::class.java]

        setupRecyclerView()

        binding.progressBar.visibility = View.VISIBLE
        viewModel.events.observe(viewLifecycleOwner) { events ->
            eventsAdapter.submitList(events)
            binding.progressBar.visibility = View.GONE
        }
    }

    private fun setupRecyclerView() {
        eventsAdapter = EventsAdapter()
        binding.eventsRecyclerView.apply {
            adapter = eventsAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

class EventsViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()
    private val _events = MutableLiveData<List<Event>>()
    val events: LiveData<List<Event>> = _events

    init {
        fetchEvents()
    }

    private fun fetchEvents() {
        db.collection("events")
            .whereEqualTo("is_active", true)
            .orderBy("event_date", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { result ->
                val eventsList = result.mapNotNull { document ->
                    document.toObject(Event::class.java).copy(id = document.id)
                }
                _events.value = eventsList
            }
            .addOnFailureListener {
                // Handle the error, e.g., post an error state to LiveData
            }
    }
}

class EventsAdapter : RecyclerView.Adapter<EventsAdapter.EventViewHolder>() {

    private var events: List<Event> = emptyList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventViewHolder {
        val binding = ItemEventBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return EventViewHolder(binding)
    }

    override fun onBindViewHolder(holder: EventViewHolder, position: Int) {
        holder.bind(events[position])
    }

    override fun getItemCount(): Int = events.size

    fun submitList(newEvents: List<Event>) {
        events = newEvents
        notifyDataSetChanged()
    }

    class EventViewHolder(private val binding: ItemEventBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(event: Event) {
            binding.eventType.text = event.event_type.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.ROOT) else it.toString() }
            binding.eventTitle.text = event.title
            binding.eventDateTime.text = itemView.context.getString(R.string.event_date_time_format, event.getFormattedDate(), event.getFormattedTime())
            binding.eventPlatform.text = itemView.context.getString(R.string.event_platform_format, event.platform)
        }
    }
}
