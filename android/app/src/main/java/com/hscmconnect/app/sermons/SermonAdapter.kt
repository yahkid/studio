package com.hscmconnect.app.sermons

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.Timestamp
import com.hscmconnect.app.R
import com.hscmconnect.app.model.Sermon
import java.text.SimpleDateFormat
import java.util.*

class SermonAdapter(private var sermons: List<Sermon>) :
    RecyclerView.Adapter<SermonAdapter.SermonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.bind(sermon)
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, SermonDetailActivity::class.java).apply {
                putExtra("SERMON_EXTRA", sermon)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = sermons.size

    fun updateData(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val thumbnail: ImageView = itemView.findViewById(R.id.sermonThumbnail)
        private val title: TextView = itemView.findViewById(R.id.sermonTitle)
        private val speaker: TextView = itemView.findViewById(R.id.sermonSpeaker)
        private val date: TextView = itemView.findViewById(R.id.sermonDate)

        fun bind(sermon: Sermon) {
            title.text = sermon.title
            speaker.text = sermon.speaker
            date.text = formatTimestamp(sermon.sermon_date)
            val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/0.jpg"
            Glide.with(itemView.context)
                .load(thumbnailUrl)
                .placeholder(R.drawable.ic_sermons_24)
                .into(thumbnail)
        }

        private fun formatTimestamp(timestamp: Timestamp): String {
            val sdf = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
            return sdf.format(timestamp.toDate())
        }
    }
}
