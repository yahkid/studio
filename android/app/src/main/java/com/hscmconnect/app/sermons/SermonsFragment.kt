
package com.hscmconnect.app.sermons

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.hscmconnect.app.databinding.FragmentSermonsBinding

open class SermonsFragment : Fragment() {

    private var _binding: FragmentSermonsBinding? = null
    private val binding get() = _binding!!
    private lateinit var db: FirebaseFirestore
    private lateinit var sermonAdapter: SermonAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSermonsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        db = FirebaseFirestore.getInstance()
        setupRecyclerView()
        fetchSermons()
    }

    private fun setupRecyclerView() {
        sermonAdapter = SermonAdapter(emptyList())
        binding.sermonsRecyclerView.apply {
            layoutManager = LinearLayoutManager(context)
            adapter = sermonAdapter
        }
    }

    private fun fetchSermons() {
        binding.progressBar.visibility = View.VISIBLE
        db.collection("sermons")
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { result ->
                val sermons = result.toObjects(Sermon::class.java).mapIndexed { index, sermon ->
                    sermon.copy(id = result.documents[index].id)
                }
                sermonAdapter.updateSermons(sermons)
                binding.progressBar.visibility = View.GONE
            }
            .addOnFailureListener { exception ->
                binding.progressBar.visibility = View.GONE
                Toast.makeText(context, "Error getting sermons: ${exception.message}", Toast.LENGTH_LONG).show()
            }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
