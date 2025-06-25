package com.holyspiritconnect.hscapp.sermons

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.holyspiritconnect.hscapp.databinding.ActivitySermonDetailBinding
import com.holyspiritconnect.hscapp.models.Sermon

class SermonDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySermonDetailBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySermonDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val sermon = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra("sermon", Sermon::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra("sermon")
        }

        sermon?.let {
            supportActionBar?.title = it.title
            binding.sermonDetailTitle.text = it.title
            binding.sermonDetailSpeaker.text = it.speaker
            binding.sermonDetailDescription.text = it.description
            binding.sermonDetailDate.text = it.getFormattedDate()

            binding.youtubeWebView.apply {
                settings.javaScriptEnabled = true
                webViewClient = WebViewClient()
                webChromeClient = WebChromeClient()
                val frameVideo = "<html><body><iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/${it.youtube_video_id}\" frameborder=\"0\" allowfullscreen></iframe></body></html>"
                loadData(frameVideo, "text/html", "utf-8")
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
