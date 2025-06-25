package com.hscmconnect.app.sermons

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.webkit.WebView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.Timestamp
import com.hscmconnect.app.R
import com.hscmconnect.app.model.Sermon
import java.text.SimpleDateFormat
import java.util.*

class SermonDetailActivity : AppCompatActivity() {

    private lateinit var youtubeWebView: WebView
    private lateinit var sermonDetailTitle: TextView
    private lateinit var sermonDetailSpeaker: TextView
    private lateinit var sermonDetailDate: TextView
    private lateinit var sermonDetailDescription: TextView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sermon_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        youtubeWebView = findViewById(R.id.youtubeWebView)
        sermonDetailTitle = findViewById(R.id.sermonDetailTitle)
        sermonDetailSpeaker = findViewById(R.id.sermonDetailSpeaker)
        sermonDetailDate = findViewById(R.id.sermonDetailDate)
        sermonDetailDescription = findViewById(R.id.sermonDetailDescription)

        // Retrieve the Sermon object
        val sermon = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra("SERMON_EXTRA", Sermon::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra("SERMON_EXTRA")
        }


        if (sermon != null) {
            title = sermon.title
            sermonDetailTitle.text = sermon.title
            sermonDetailSpeaker.text = sermon.speaker
            sermonDetailDate.text = formatTimestamp(sermon.sermon_date)
            sermonDetailDescription.text = sermon.description

            // Load YouTube video in WebView
            val videoId = sermon.youtube_video_id
            val webSettings = youtubeWebView.settings
            webSettings.javaScriptEnabled = true
            val frameVideo = "<html><body><iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/$videoId\" frameborder=\"0\" allowfullscreen></iframe></body></html>"
            youtubeWebView.loadData(frameVideo, "text/html", "utf-8")
        }
    }

    private fun formatTimestamp(timestamp: Timestamp): String {
        val sdf = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
        return sdf.format(timestamp.toDate())
    }

    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
