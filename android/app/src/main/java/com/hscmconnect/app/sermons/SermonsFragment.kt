package com.hscmconnect.app.sermons

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class SermonsFragment : Fragment() {

    private lateinit var sermonsRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var sermonAdapter: SermonAdapter
    private val viewModel: SermonsViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_sermons, container, false)
        sermonsRecyclerView = view.findViewById(R.id.sermonsRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        
        setupRecyclerView()

        viewModel.sermons.observe(viewLifecycleOwner, Observer { sermons ->
            sermonAdapter.updateSermons(sermons)
        })

        viewModel.isLoading.observe(viewLifecycleOwner, Observer { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        })

        return view
    }

    private fun setupRecyclerView() {
        sermonAdapter = SermonAdapter(emptyList())
        sermonsRecyclerView.layoutManager = LinearLayoutManager(context)
        sermonsRecyclerView.adapter = sermonAdapter
    }
}
