package com.hscmconnect.app.sermons

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView
import android.widget.TextView
import com.hscmconnect.app.R
import java.text.SimpleDateFormat
import java.util.*

class SermonDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_SERMON = "extra_sermon"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sermon_detail)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val sermon = intent.getParcelableExtra<Sermon>(EXTRA_SERMON)

        if (sermon != null) {
            val webView: WebView = findViewById(R.id.youtubeWebView)
            val title: TextView = findViewById(R.id.sermonDetailTitle)
            val speaker: TextView = findViewById(R.id.sermonDetailSpeaker)
            val date: TextView = findViewById(R.id.sermonDetailDate)
            val description: TextView = findViewById(R.id.sermonDetailDescription)
            
            title.text = sermon.title
            speaker.text = sermon.speaker
            val sdf = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
            date.text = sdf.format(sermon.sermon_date)
            description.text = sermon.description

            webView.settings.javaScriptEnabled = true
            val frameVideo = "<html><body><iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/${sermon.youtube_video_id}\" frameborder=\"0\" allowfullscreen></iframe></body></html>"
            webView.loadData(frameVideo, "text/html", "utf-8")
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}
