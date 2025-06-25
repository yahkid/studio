
package com.holyspiritconnect.hscapp.sermons

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Sermon
import java.text.SimpleDateFormat
import java.util.Locale

class SermonAdapter(private val sermons: List<Sermon>, private val onItemClicked: (Sermon) -> Unit) :
    RecyclerView.Adapter<SermonAdapter.SermonViewHolder>() {

    class SermonViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val thumbnail: ImageView = view.findViewById(R.id.sermonThumbnail)
        val title: TextView = view.findViewById(R.id.sermonTitle)
        val speaker: TextView = view.findViewById(R.id.sermonSpeaker)
        val date: TextView = view.findViewById(R.id.sermonDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.title.text = sermon.title
        holder.speaker.text = sermon.speaker
        
        val outputFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
        holder.date.text = sermon.sermon_date?.let { outputFormat.format(it) } ?: ""

        val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg"
        Glide.with(holder.itemView.context)
            .load(thumbnailUrl)
            .into(holder.thumbnail)
            
        holder.itemView.setOnClickListener {
            onItemClicked(sermon)
        }
    }

    override fun getItemCount() = sermons.size
}
