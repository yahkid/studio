package com.holyspiritconnect.hscapp.leadership

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.holyspiritconnect.hscapp.databinding.ActivityLeadershipBinding

class LeadershipActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLeadershipBinding
    private val viewModel: LeadershipViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLeadershipBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "Our Leadership"

        val leadershipAdapter = LeadershipAdapter(emptyList())
        binding.leadershipRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@LeadershipActivity)
            adapter = leadershipAdapter
        }

        viewModel.leaders.observe(this) { leaders ->
            leadershipAdapter.updateLeaders(leaders)
        }

        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
