
package com.hscmconnect.app.sermons

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.hscmconnect.app.R

class SermonsFragment : Fragment() {

    private val viewModel: SermonsViewModel by viewModels()
    private lateinit var sermonsAdapter: SermonsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_sermons, container, false)

        val recyclerView: RecyclerView = view.findViewById(R.id.sermonsRecyclerView)
        val progressBar: ProgressBar = view.findViewById(R.id.progressBar)

        sermonsAdapter = SermonsAdapter(emptyList())
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = sermonsAdapter

        viewModel.sermons.observe(viewLifecycleOwner) { sermons ->
            sermonsAdapter.updateSermons(sermons)
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            if (error != null) {
                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
            }
        }

        return view
    }
}
