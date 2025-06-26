
package com.holyspiritconnect.hscapp

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.google.firebase.auth.FirebaseAuth
import com.holyspiritconnect.hscapp.databinding.FragmentHomeBinding
import com.holyspiritconnect.hscapp.sermons.SermonDetailActivity
import com.holyspiritconnect.hscapp.viewmodels.HomeViewModel
import java.text.SimpleDateFormat
import java.util.*

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private val viewModel: HomeViewModel by viewModels()
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupWelcomeMessage()
        observeViewModel()
    }

    private fun setupWelcomeMessage() {
        val user = auth.currentUser
        val name = user?.displayName?.split(" ")?.firstOrNull() ?: "there"
        binding.welcomeText.text = "Welcome, $name!"
    }

    private fun observeViewModel() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.isVisible = isLoading
        }

        viewModel.featuredSermon.observe(viewLifecycleOwner) { sermon ->
            if (sermon != null) {
                binding.featuredSermonCard.isVisible = true
                binding.sermonTitle.text = sermon.title
                binding.sermonSpeaker.text = sermon.speaker
                val thumbnailUrl = "https://img.youtube.com/vi/${sermon.youtubeVideoId}/mqdefault.jpg"
                Glide.with(this).load(thumbnailUrl).into(binding.sermonThumbnail)
                binding.featuredSermonCard.setOnClickListener {
                    val intent = Intent(activity, SermonDetailActivity::class.java).apply {
                        putExtra(SermonDetailActivity.EXTRA_SERMON, sermon)
                    }
                    startActivity(intent)
                }
            } else {
                binding.featuredSermonCard.isVisible = false
            }
        }

        viewModel.upcomingEvent.observe(viewLifecycleOwner) { event ->
            if (event != null) {
                binding.upcomingEventCard.isVisible = true
                binding.eventTitle.text = event.title

                val dateFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
                val formattedDate = dateFormat.format(event.eventDate)
                binding.eventDate.text = getString(R.string.event_date_time_format, formattedDate, event.startTime)
            } else {
                binding.upcomingEventCard.isVisible = false
            }
        }
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
