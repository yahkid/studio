package com.hscmconnect.app.leadership

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import androidx.activity.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class LeadershipActivity : AppCompatActivity() {

    private lateinit var leadershipRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var leadershipAdapter: LeadershipAdapter
    private val viewModel: LeadershipViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_leadership)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        title = getString(R.string.leadership)

        leadershipRecyclerView = findViewById(R.id.leadershipRecyclerView)
        progressBar = findViewById(R.id.progressBar)

        setupRecyclerView()

        viewModel.leaders.observe(this, Observer { leaders ->
            leadershipAdapter.updateLeaders(leaders)
        })

        viewModel.isLoading.observe(this, Observer { isLoading ->
            progressBar.visibility = if(isLoading) View.VISIBLE else View.GONE
        })
    }

    private fun setupRecyclerView() {
        leadershipAdapter = LeadershipAdapter(emptyList())
        leadershipRecyclerView.layoutManager = LinearLayoutManager(this)
        leadershipRecyclerView.adapter = leadershipAdapter
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
