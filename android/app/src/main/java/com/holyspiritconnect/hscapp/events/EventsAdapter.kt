
package com.holyspiritconnect.hscapp.events

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R
import java.text.SimpleDateFormat
import java.util.*

class EventsAdapter(private val context: Context, private var events: List<Event>) :
    RecyclerView.Adapter<EventsAdapter.EventViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EventViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_event, parent, false)
        return EventViewHolder(view)
    }

    override fun onBindViewHolder(holder: EventViewHolder, position: Int) {
        val event = events[position]
        holder.bind(event)
    }

    override fun getItemCount(): Int = events.size

    fun updateEvents(newEvents: List<Event>) {
        events = newEvents
        notifyDataSetChanged()
    }

    inner class EventViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val eventType: TextView = itemView.findViewById(R.id.eventType)
        private val eventTitle: TextView = itemView.findViewById(R.id.eventTitle)
        private val eventDateTime: TextView = itemView.findViewById(R.id.eventDateTime)
        private val eventPlatform: TextView = itemView.findViewById(R.id.eventPlatform)

        fun bind(event: Event) {
            eventType.text = event.event_type.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
            eventTitle.text = event.title

            val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
            val dateString = dateFormat.format(event.event_date.toDate())
            val timeString = context.getString(R.string.event_date_time_format, dateString, event.start_time)
            eventDateTime.text = timeString

            eventPlatform.text = context.getString(R.string.event_platform_format, event.platform)
        }
    }
}
