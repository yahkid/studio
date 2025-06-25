package com.holyspiritconnect.hscapp.sermons

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.holyspiritconnect.hscapp.databinding.FragmentSermonsBinding
import com.holyspiritconnect.hscapp.databinding.ItemSermonBinding
import com.holyspiritconnect.hscapp.models.Sermon

class SermonsFragment : Fragment() {

    private var _binding: FragmentSermonsBinding? = null
    private val binding get() = _binding!!
    private lateinit var viewModel: SermonsViewModel
    private lateinit var sermonsAdapter: SermonsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSermonsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewModel = ViewModelProvider(this)[SermonsViewModel::class.java]

        setupRecyclerView()

        binding.progressBar.visibility = View.VISIBLE
        viewModel.sermons.observe(viewLifecycleOwner) { sermons ->
            sermonsAdapter.submitList(sermons)
            binding.progressBar.visibility = View.GONE
        }
    }

    private fun setupRecyclerView() {
        sermonsAdapter = SermonsAdapter()
        binding.sermonsRecyclerView.apply {
            adapter = sermonsAdapter
            layoutManager = LinearLayoutManager(context)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

class SermonsViewModel : ViewModel() {
    private val db = FirebaseFirestore.getInstance()
    private val _sermons = MutableLiveData<List<Sermon>>()
    val sermons: LiveData<List<Sermon>> = _sermons

    init {
        fetchSermons()
    }

    private fun fetchSermons() {
        db.collection("sermons")
            .orderBy("sermon_date", Query.Direction.DESC)
            .get()
            .addOnSuccessListener { result ->
                val sermonsList = result.documents.map { document ->
                    document.toObject(Sermon::class.java)!!.copy(id = document.id)
                }
                _sermons.value = sermonsList
            }
            .addOnFailureListener {
                // Handle error
            }
    }
}

class SermonsAdapter : RecyclerView.Adapter<SermonsAdapter.SermonViewHolder>() {

    private var sermons: List<Sermon> = emptyList()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val binding = ItemSermonBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SermonViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.bind(sermon)
        holder.itemView.setOnClickListener {
            val context = holder.itemView.context
            val intent = Intent(context, SermonDetailActivity::class.java).apply {
                putExtra("sermon", sermon)
            }
            context.startActivity(intent)
        }
    }

    override fun getItemCount(): Int = sermons.size

    fun submitList(newSermons: List<Sermon>) {
        sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(private val binding: ItemSermonBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(sermon: Sermon) {
            binding.sermonTitle.text = sermon.title
            binding.sermonSpeaker.text = sermon.speaker
            binding.sermonDate.text = sermon.getFormattedDate()
            Glide.with(itemView.context).load(sermon.getThumbnailUrl()).into(binding.sermonThumbnail)
        }
    }
}
