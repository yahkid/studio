package com.hscmconnect.sermons

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.R
import java.text.SimpleDateFormat
import java.util.Locale

class SermonAdapter(private var sermons: List<Sermon>) : RecyclerView.Adapter<SermonAdapter.SermonViewHolder>() {

    class SermonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val sermonThumbnail: ImageView = itemView.findViewById(R.id.sermonThumbnail)
        val sermonTitle: TextView = itemView.findViewById(R.id.sermonTitle)
        val sermonSpeaker: TextView = itemView.findViewById(R.id.sermonSpeaker)
        val sermonDate: TextView = itemView.findViewById(R.id.sermonDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.sermonTitle.text = sermon.title
        holder.sermonSpeaker.text = sermon.speaker

        val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg"
        Glide.with(holder.itemView.context)
            .load(thumbnailUrl)
            .placeholder(R.drawable.ic_sermons_24)
            .into(holder.sermonThumbnail)

        // Format and display the date
        val outputFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
        holder.sermonDate.text = outputFormat.format(sermon.sermon_date)

        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, SermonDetailActivity::class.java).apply {
                putExtra(SermonDetailActivity.EXTRA_YOUTUBE_ID, sermon.youtube_video_id)
                putExtra(SermonDetailActivity.EXTRA_TITLE, sermon.title)
                putExtra(SermonDetailActivity.EXTRA_SPEAKER, sermon.speaker)
                putExtra(SermonDetailActivity.EXTRA_DESCRIPTION, sermon.description)
                putExtra(SermonDetailActivity.EXTRA_DATE, outputFormat.format(sermon.sermon_date))
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount() = sermons.size

    fun updateSermons(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }
}
