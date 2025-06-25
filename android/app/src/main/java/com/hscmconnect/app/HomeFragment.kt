
package com.hscmconnect.app

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.google.android.material.card.MaterialCardView
import com.google.firebase.auth.FirebaseAuth
import com.hscmconnect.app.home.HomeViewModel
import java.text.SimpleDateFormat
import java.util.*

class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel
    private val auth = FirebaseAuth.getInstance()

    // Views
    private lateinit var welcomeText: TextView
    private lateinit var progressBar: ProgressBar

    // Featured Sermon Views
    private lateinit var featuredSermonCard: MaterialCardView
    private lateinit var sermonThumbnail: ImageView
    private lateinit var sermonTitle: TextView
    private lateinit var sermonSpeaker: TextView

    // Upcoming Event Views
    private lateinit var upcomingEventCard: MaterialCardView
    private lateinit var eventTitle: TextView
    private lateinit var eventDate: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        // Initialize Views
        welcomeText = view.findViewById(R.id.welcome_text)
        progressBar = view.findViewById(R.id.progressBar)

        featuredSermonCard = view.findViewById(R.id.featured_sermon_card)
        sermonThumbnail = view.findViewById(R.id.sermonThumbnail)
        sermonTitle = view.findViewById(R.id.sermonTitle)
        sermonSpeaker = view.findViewById(R.id.sermonSpeaker)

        upcomingEventCard = view.findViewById(R.id.upcoming_event_card)
        eventTitle = view.findViewById(R.id.eventTitle)
        eventDate = view.findViewById(R.id.eventDate)

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        homeViewModel = ViewModelProvider(this).get(HomeViewModel::class.java)

        setupWelcomeMessage()
        setupObservers()

        homeViewModel.fetchHomeContent()
    }

    private fun setupWelcomeMessage() {
        val currentUser = auth.currentUser
        val displayName = currentUser?.displayName?.split(" ")?.get(0) ?: "Mgeni"
        welcomeText.text = "Karibu, $displayName!"
    }

    private fun setupObservers() {
        homeViewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        homeViewModel.featuredSermon.observe(viewLifecycleOwner) { sermon ->
            if (sermon != null) {
                featuredSermonCard.visibility = View.VISIBLE
                sermonTitle.text = sermon.title
                sermonSpeaker.text = sermon.speaker

                val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg"
                if (isAdded) {
                     Glide.with(this)
                        .load(thumbnailUrl)
                        .into(sermonThumbnail)
                }

                featuredSermonCard.setOnClickListener {
                    Toast.makeText(context, "Kufungua ujumbe: ${sermon.title}", Toast.LENGTH_SHORT).show()
                }
            } else {
                featuredSermonCard.visibility = View.GONE
            }
        }

        homeViewModel.upcomingEvent.observe(viewLifecycleOwner) { event ->
            if (event != null) {
                upcomingEventCard.visibility = View.VISIBLE
                eventTitle.text = event.title

                val date = event.eventDate?.toDate()
                if (date != null) {
                    val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
                    eventDate.text = "${dateFormat.format(date)} saa ${event.startTime}"
                } else {
                    eventDate.text = ""
                }

                upcomingEventCard.setOnClickListener {
                     Toast.makeText(context, "Kufungua tukio: ${event.title}", Toast.LENGTH_SHORT).show()
                }
            } else {
                upcomingEventCard.visibility = View.GONE
            }
        }

        homeViewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let {
                if (isAdded) {
                    Toast.makeText(context, it, Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
