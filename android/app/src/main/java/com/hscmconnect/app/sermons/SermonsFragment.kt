
package com.hscmconnect.app.sermons

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
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
import com.hscmconnect.app.R
import java.text.SimpleDateFormat
import java.util.*
import com.google.firebase.Timestamp
import com.google.firebase.firestore.PropertyName

class SermonsFragment : Fragment() {

    private lateinit var sermonsRecyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var sermonsViewModel: SermonsViewModel
    private lateinit var adapter: SermonsAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_sermons, container, false)
        sermonsRecyclerView = view.findViewById(R.id.sermonsRecyclerView)
        progressBar = view.findViewById(R.id.progressBar)
        sermonsRecyclerView.layoutManager = LinearLayoutManager(context)
        adapter = SermonsAdapter(emptyList())
        sermonsRecyclerView.adapter = adapter
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        sermonsViewModel = ViewModelProvider(this).get(SermonsViewModel::class.java)

        sermonsViewModel.sermons.observe(viewLifecycleOwner) { sermons ->
            adapter.updateSermons(sermons)
        }

        sermonsViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }
    }
}

class SermonsViewModel : ViewModel() {
    private val _sermons = MutableLiveData<List<Sermon>>()
    val sermons: LiveData<List<Sermon>> = _sermons

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val db = FirebaseFirestore.getInstance()

    init {
        loadSermons()
    }

    private fun loadSermons() {
        _isLoading.value = true
        db.collection("sermons")
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { documents ->
                val sermonsList = ArrayList<Sermon>()
                for (document in documents) {
                    val sermon = document.toObject(Sermon::class.java)
                    sermon.id = document.id
                    sermonsList.add(sermon)
                }
                _sermons.value = sermonsList
                _isLoading.value = false
            }
            .addOnFailureListener { exception ->
                // Handle the error
                _isLoading.value = false
            }
    }
}

class SermonsAdapter(private var sermons: List<Sermon>) : RecyclerView.Adapter<SermonsAdapter.SermonViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SermonViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sermon, parent, false)
        return SermonViewHolder(view)
    }

    override fun onBindViewHolder(holder: SermonViewHolder, position: Int) {
        val sermon = sermons[position]
        holder.bind(sermon)
    }

    override fun getItemCount(): Int = sermons.size

    fun updateSermons(newSermons: List<Sermon>) {
        this.sermons = newSermons
        notifyDataSetChanged()
    }

    class SermonViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val titleTextView: TextView = itemView.findViewById(R.id.sermonTitle)
        private val speakerTextView: TextView = itemView.findViewById(R.id.sermonSpeaker)
        private val dateTextView: TextView = itemView.findViewById(R.id.sermonDate)
        private val thumbnailImageView: ImageView = itemView.findViewById(R.id.sermonThumbnail)

        fun bind(sermon: Sermon) {
            titleTextView.text = sermon.title
            speakerTextView.text = sermon.speaker
            sermon.sermonDate?.toDate()?.let {
                dateTextView.text = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault()).format(it)
            }
            val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg"
            Glide.with(itemView.context)
                .load(thumbnailUrl)
                .into(thumbnailImageView)
        }
    }
}
