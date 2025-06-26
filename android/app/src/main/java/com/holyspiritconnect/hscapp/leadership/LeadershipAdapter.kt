package com.holyspiritconnect.hscapp.leadership

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.databinding.ItemLeaderBinding
import com.holyspiritconnect.hscapp.models.Leadership

class LeadershipAdapter(private var leaders: List<Leadership>) :
    RecyclerView.Adapter<LeadershipAdapter.LeaderViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LeaderViewHolder {
        val binding = ItemLeaderBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LeaderViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LeaderViewHolder, position: Int) {
        holder.bind(leaders[position])
    }

    override fun getItemCount(): Int = leaders.size

    fun updateLeaders(newLeaders: List<Leadership>) {
        leaders = newLeaders
        notifyDataSetChanged()
    }

    class LeaderViewHolder(private val binding: ItemLeaderBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(leader: Leadership) {
            binding.leaderName.text = leader.name
            binding.leaderTitle.text = leader.title
            binding.leaderBio.text = leader.bio

            Glide.with(itemView.context)
                .load(leader.imageSrc)
                .placeholder(R.drawable.ic_home_24) // A placeholder
                .into(binding.leaderImage)
        }
    }
}
