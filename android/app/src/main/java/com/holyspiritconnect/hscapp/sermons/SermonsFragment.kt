
package com.holyspiritconnect.hscapp.sermons

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.holyspiritconnect.hscapp.R

class SermonsFragment : Fragment() {

    private val viewModel: SermonsViewModel by viewModels()
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_sermons, container, false)
        recyclerView = view.findViewById(R.id.sermonsRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        recyclerView.layoutManager = LinearLayoutManager(context)

        observeViewModel()

        return view
    }

    private fun observeViewModel() {
        viewModel.sermons.observe(viewLifecycleOwner) { sermons ->
            recyclerView.adapter = SermonAdapter(sermons) { sermon ->
                val intent = Intent(activity, SermonDetailActivity::class.java)
                intent.putExtra(SermonDetailActivity.EXTRA_SERMON, sermon)
                startActivity(intent)
            }
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.isVisible = isLoading
            recyclerView.isVisible = !isLoading
        }

        // You can also observe viewModel.error and show a message
    }
}
