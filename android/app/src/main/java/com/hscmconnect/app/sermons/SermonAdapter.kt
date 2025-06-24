
package com.hscmconnect.app.sermons

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.databinding.ItemSermonBinding
import java.text.SimpleDateFormat
import java.util.*

class SermonAdapter(private var sermons: List<Sermon>) :
    RecyclerView.Adapter<SermonAdapter.SermonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val binding = ItemSermonBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SermonViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        holder.bind(sermons[position])
    }

    override fun getItemCount() = sermons.size

    fun updateSermons(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(private val binding: ItemSermonBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(sermon: Sermon) {
            binding.sermonTitle.text = sermon.title
            binding.sermonSpeaker.text = sermon.speaker

            val sdf = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
            binding.sermonDate.text = sermon.sermon_date?.toDate()?.let { sdf.format(it) } ?: ""

            val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg"
            Glide.with(binding.root.context)
                .load(thumbnailUrl)
                .into(binding.sermonThumbnail)
        }
    }
}
