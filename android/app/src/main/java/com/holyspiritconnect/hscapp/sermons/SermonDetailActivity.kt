
package com.holyspiritconnect.hscapp.sermons

import android.os.Bundle
import android.webkit.WebView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.holyspiritconnect.hscapp.R
import com.holyspiritconnect.hscapp.models.Sermon
import java.text.SimpleDateFormat
import java.util.Locale

class SermonDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_SERMON = "extra_sermon"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sermon_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val sermon = intent.getParcelableExtra<Sermon>(EXTRA_SERMON)

        sermon?.let {
            val titleTextView: TextView = findViewById(R.id.sermonDetailTitle)
            val speakerTextView: TextView = findViewById(R.id.sermonDetailSpeaker)
            val dateTextView: TextView = findViewById(R.id.sermonDetailDate)
            val descriptionTextView: TextView = findViewById(R.id.sermonDetailDescription)
            val webView: WebView = findViewById(R.id.youtubeWebView)

            titleTextView.text = it.title
            speakerTextView.text = it.speaker
            descriptionTextView.text = it.description

            val outputFormat = SimpleDateFormat("MMMM d, yyyy", Locale.getDefault())
            dateTextView.text = it.sermon_date?.let { date -> outputFormat.format(date) } ?: "Date not available"

            webView.settings.javaScriptEnabled = true
            val videoId = it.youtube_video_id
            val iframe = "<iframe width=\"100%\" height=\"100%\" src=\"https://www.youtube.com/embed/$videoId\" frameborder=\"0\" allowfullscreen></iframe>"
            webView.loadData(iframe, "text/html", "utf-8")
        }
    }
    
    override fun onSupportNavigateUp(): Boolean {
        finish()
        return true
    }
}
