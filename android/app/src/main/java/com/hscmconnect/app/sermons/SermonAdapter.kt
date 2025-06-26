package com.hscmconnect.app.sermons

import android.content.Intent
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

class SermonAdapter(private var sermons: List<Sermon>) : RecyclerView.Adapter<SermonAdapter.SermonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.bind(sermon)
    }

    override fun getItemCount() = sermons.size

    fun updateSermons(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val sermonThumbnail: ImageView = itemView.findViewById(R.id.sermonThumbnail)
        private val sermonTitle: TextView = itemView.findViewById(R.id.sermonTitle)
        private val sermonSpeaker: TextView = itemView.findViewById(R.id.sermonSpeaker)
        private val sermonDate: TextView = itemView.findViewById(R.id.sermonDate)

        fun bind(sermon: Sermon) {
            sermonTitle.text = sermon.title
            sermonSpeaker.text = sermon.speaker
            val sdf = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
            sermonDate.text = sdf.format(sermon.sermon_date)
            val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/0.jpg"
            Glide.with(itemView.context).load(thumbnailUrl).into(sermonThumbnail)

            itemView.setOnClickListener {
                val context = itemView.context
                val intent = Intent(context, SermonDetailActivity::class.java).apply {
                    putExtra(SermonDetailActivity.EXTRA_SERMON, sermon)
                }
                context.startActivity(intent)
            }
        }
    }
}
