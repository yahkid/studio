package com.hscmconnect.app.events

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R
import java.text.SimpleDateFormat
import java.util.Locale

class EventsAdapter(private var events: List<Event>) : RecyclerView.Adapter<EventsAdapter.EventViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_event, parent, false)
        return EventViewHolder(view)
    }

    override fun onBindViewHolder(holder: EventViewHolder, position: Int) {
        val event = events[position]
        holder.bind(event)
    }

    override fun getItemCount() = events.size

    fun updateEvents(newEvents: List<Event>) {
        events = newEvents
        notifyDataSetChanged()
    }

    class EventViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val eventType: TextView = itemView.findViewById(R.id.eventType)
        private val eventTitle: TextView = itemView.findViewById(R.id.eventTitle)
        private val eventDateTime: TextView = itemView.findViewById(R.id.eventDateTime)
        private val eventPlatform: TextView = itemView.findViewById(R.id.eventPlatform)

        fun bind(event: Event) {
            eventType.text = event.event_type
            eventTitle.text = event.title
            val sdf = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())
            val dateStr = sdf.format(event.date)
            val timeStr = "${event.start_time} - ${event.end_time}"
            eventDateTime.text = itemView.context.getString(R.string.event_date_time_format, dateStr, timeStr)
            eventPlatform.text = itemView.context.getString(R.string.event_platform_format, event.platform)
        }
    }
}
