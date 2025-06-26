package com.hscmconnect.app

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import androidx.cardview.widget.CardView
import com.bumptech.glide.Glide
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.hscmconnect.app.sermons.Sermon
import com.hscmconnect.app.sermons.SermonDetailActivity
import com.hscmconnect.app.events.Event
import java.text.SimpleDateFormat
import java.util.*

class HomeFragment : Fragment() {

    private lateinit var welcomeText: TextView
    private lateinit var featuredSermonCard: CardView
    private lateinit var sermonThumbnail: ImageView
    private lateinit var sermonTitle: TextView
    private lateinit var sermonSpeaker: TextView
    private lateinit var upcomingEventCard: CardView
    private lateinit var eventTitle: TextView
    private lateinit var eventDate: TextView
    private lateinit var progressBar: ProgressBar

    private val db = FirebaseFirestore.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)
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
        loadFeaturedSermon()
        loadUpcomingEvent()

        return view
    }

    private fun setupWelcomeMessage() {
        val user = FirebaseAuth.getInstance().currentUser
        val name = user?.displayName?.split(" ")?.get(0) ?: "User"
        welcomeText.text = "Welcome, $name!"
    }

    private fun loadFeaturedSermon() {
        progressBar.visibility = View.VISIBLE
        db.collection("sermons")
            .whereEqualTo("is_featured", true)
            .orderBy("sermon_date", Query.Direction.DESCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (!documents.isEmpty) {
                    val sermon = documents.documents[0].toObject(Sermon::class.java)
                    if (sermon != null) {
                        sermon.id = documents.documents[0].id
                        featuredSermonCard.visibility = View.VISIBLE
                        sermonTitle.text = sermon.title
                        sermonSpeaker.text = sermon.speaker
                        val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtube_video_id}/0.jpg"
                        Glide.with(this).load(thumbnailUrl).into(sermonThumbnail)

                        featuredSermonCard.setOnClickListener {
                            val intent = Intent(activity, SermonDetailActivity::class.java)
                            intent.putExtra(SermonDetailActivity.EXTRA_SERMON, sermon)
                            startActivity(intent)
                        }
                    }
                }
                progressBar.visibility = View.GONE
            }
            .addOnFailureListener {
                progressBar.visibility = View.GONE
            }
    }

    private fun loadUpcomingEvent() {
        db.collection("events")
            .whereGreaterThanOrEqualTo("event_date", Date())
            .orderBy("event_date", Query.Direction.ASCENDING)
            .limit(1)
            .get()
            .addOnSuccessListener { documents ->
                if (!documents.isEmpty) {
                    val event = documents.documents[0].toObject(Event::class.java)
                    if (event != null) {
                        upcomingEventCard.visibility = View.VISIBLE
                        eventTitle.text = event.title
                        val sdf = SimpleDateFormat("MMM dd, yyyy 'at' HH:mm", Locale.getDefault())
                        eventDate.text = sdf.format(event.date) + " " + event.start_time
                    }
                }
            }
    }
}
