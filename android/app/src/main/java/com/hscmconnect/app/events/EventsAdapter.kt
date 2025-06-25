
package com.hscmconnect.app.events

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R
import com.hscmconnect.app.models.Event
import java.text.SimpleDateFormat
import java.util.Locale

class EventsAdapter(private var events: List<Event>) : RecyclerView.Adapter<EventsAdapter.EventViewHolder>() {

    class EventViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val eventType: TextView = itemView.findViewById(R.id.eventType)
        val eventTitle: TextView = itemView.findViewById(R.id.eventTitle)
        val eventDateTime: TextView = itemView.findViewById(R.id.eventDateTime)
        val eventPlatform: TextView = itemView.findViewById(R.id.eventPlatform)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_event, parent, false)
        return EventViewHolder(view)
    }

    override fun onBindViewHolder(holder: EventViewHolder, position: Int) {
        val event = events[position]

        val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
        val dateString = dateFormat.format(event.event_date.toDate())

        holder.eventType.text = event.event_type
        holder.eventTitle.text = event.title
        holder.eventDateTime.text = "$dateString at ${event.start_time} - ${event.end_time}"
        holder.eventPlatform.text = "Platform: ${event.platform}"
    }

    override fun getItemCount() = events.size

    fun updateEvents(newEvents: List<Event>) {
        events = newEvents
        notifyDataSetChanged()
    }
}
