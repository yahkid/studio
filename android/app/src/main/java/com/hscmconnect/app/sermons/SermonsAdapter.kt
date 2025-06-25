
package com.hscmconnect.app.sermons

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R
import java.text.SimpleDateFormat
import java.util.*

class SermonsAdapter(private var sermons: List<Sermon>) : RecyclerView.Adapter<SermonsAdapter.SermonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        holder.bind(sermons[position])
    }

    override fun getItemCount(): Int = sermons.size

    fun updateSermons(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val title: TextView = itemView.findViewById(R.id.sermonTitle)
        private val speaker: TextView = itemView.findViewById(R.id.sermonSpeaker)
        private val date: TextView = itemView.findViewById(R.id.sermonDate)
        private val thumbnail: ImageView = itemView.findViewById(R.id.sermonThumbnail)

        fun bind(sermon: Sermon) {
            title.text = sermon.title
            speaker.text = sermon.speaker
            
            sermon.sermon_date?.toDate()?.let {
                val sdf = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
                date.text = sdf.format(it)
            }

            val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg"
            Glide.with(itemView.context)
                .load(thumbnailUrl)
                .into(thumbnail)
        }
    }
}
