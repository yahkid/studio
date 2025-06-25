package com.holyspiritconnect.hscapp

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.google.android.material.card.MaterialCardView
import com.google.firebase.auth.FirebaseAuth
import com.holyspiritconnect.hscapp.models.Event
import com.holyspiritconnect.hscapp.models.Sermon
import com.holyspiritconnect.hscapp.sermons.SermonDetailActivity
import java.text.SimpleDateFormat
import java.util.Locale

class HomeFragment : Fragment() {

    private lateinit var viewModel: HomeViewModel
    private lateinit var welcomeText: TextView
    private lateinit var featuredSermonCard: MaterialCardView
    private lateinit var sermonThumbnail: ImageView
    private lateinit var sermonTitle: TextView
    private lateinit var sermonSpeaker: TextView
    private lateinit var upcomingEventCard: MaterialCardView
    private lateinit var eventTitle: TextView
    private lateinit var eventDate: TextView
    private lateinit var progressBar: ProgressBar

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)
        viewModel = ViewModelProvider(this).get(HomeViewModel::class.java)

        welcomeText = view.findViewById(R.id.welcome_text)
        featuredSermonCard = view.findViewById(R.id.featured_sermon_card)
        sermonThumbnail = view.findViewById(R.id.sermonThumbnail)
        sermonTitle = view.findViewById(R.id.sermonTitle)
        sermonSpeaker = view.findViewById(R.id.sermonSpeaker)
        upcomingEventCard = view.findViewById(R.id.upcoming_event_card)
        eventTitle = view.findViewById(R.id.eventTitle)
        eventDate = view.findViewById(R.id.eventDate)
        progressBar = view.findViewById(R.id.progressBar)

        setupWelcomeMessage()
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        observeViewModel()
        viewModel.fetchHomeContent()
    }

    private fun setupWelcomeMessage() {
        val user = FirebaseAuth.getInstance().currentUser
        val name = user?.displayName?.split(" ")?.get(0) ?: "Guest"
        welcomeText.text = "Karibu, $name!"
    }

    private fun observeViewModel() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.featuredSermon.observe(viewLifecycleOwner) { sermon ->
            if (sermon != null) {
                bindSermonData(sermon)
                featuredSermonCard.visibility = View.VISIBLE
            } else {
                featuredSermonCard.visibility = View.GONE
            }
        }

        viewModel.upcomingEvent.observe(viewLifecycleOwner) { event ->
            if (event != null) {
                bindEventData(event)
                upcomingEventCard.visibility = View.VISIBLE
            } else {
                upcomingEventCard.visibility = View.GONE
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                Toast.makeText(context, it, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun bindSermonData(sermon: Sermon) {
        sermonTitle.text = sermon.title
        sermonSpeaker.text = sermon.speaker
        val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/mqdefault.jpg"
        Glide.with(this).load(thumbnailUrl).into(sermonThumbnail)

        featuredSermonCard.setOnClickListener {
            val intent = Intent(activity, SermonDetailActivity::class.java)
            intent.putExtra(SermonDetailActivity.EXTRA_SERMON, sermon)
            startActivity(intent)
        }
    }

    private fun bindEventData(event: Event) {
        eventTitle.text = event.title
        val dateFormat = SimpleDateFormat("MMMM d, yyyy 'at' HH:mm", Locale.getDefault())
        event.event_date?.toDate()?.let {
            eventDate.text = dateFormat.format(it)
        }

        upcomingEventCard.setOnClickListener {
            (activity as? HomeActivity)?.navigateToEvents()
        }
    }
}
