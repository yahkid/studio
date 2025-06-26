package com.hscmconnect.app.leadership

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.hscmconnect.app.R

class LeadershipAdapter(private var leaders: List<Leadership>) :
    RecyclerView.Adapter<LeadershipAdapter.LeaderViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LeaderViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_leader, parent, false)
        return LeaderViewHolder(view)
    }

    override fun onBindViewHolder(holder: LeaderViewHolder, position: Int) {
        val leader = leaders[position]
        holder.bind(leader)
    }

    override fun getItemCount() = leaders.size
    
    fun updateLeaders(newLeaders: List<Leadership>) {
        leaders = newLeaders
        notifyDataSetChanged()
    }

    class LeaderViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val leaderImage: ImageView = itemView.findViewById(R.id.leaderImage)
        private val leaderName: TextView = itemView.findViewById(R.id.leaderName)
        private val leaderTitle: TextView = itemView.findViewById(R.id.leaderTitle)
        private val leaderBio: TextView = itemView.findViewById(R.id.leaderBio)

        fun bind(leader: Leadership) {
            leaderName.text = leader.name
            leaderTitle.text = leader.title
            leaderBio.text = leader.bio
            Glide.with(itemView.context).load(leader.imageSrc).into(leaderImage)
        }
    }
}
