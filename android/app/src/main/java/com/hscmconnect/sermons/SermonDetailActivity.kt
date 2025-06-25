package com.hscmconnect.sermons

import android.os.Bundle
import android.view.MenuItem
import android.webkit.WebView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.hscmconnect.R

class SermonDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_YOUTUBE_ID = "EXTRA_YOUTUBE_ID"
        const val EXTRA_TITLE = "EXTRA_TITLE"
        const val EXTRA_SPEAKER = "EXTRA_SPEAKER"
        const val EXTRA_DATE = "EXTRA_DATE"
        const val EXTRA_DESCRIPTION = "EXTRA_DESCRIPTION"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sermon_detail)

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = getString(R.string.sermon_details_title)

        val youtubeId = intent.getStringExtra(EXTRA_YOUTUBE_ID)
        val title = intent.getStringExtra(EXTRA_TITLE)
        val speaker = intent.getStringExtra(EXTRA_SPEAKER)
        val date = intent.getStringExtra(EXTRA_DATE)
        val description = intent.getStringExtra(EXTRA_DESCRIPTION)

        val titleTextView: TextView = findViewById(R.id.sermonDetailTitle)
        val speakerTextView: TextView = findViewById(R.id.sermonDetailSpeaker)
        val dateTextView: TextView = findViewById(R.id.sermonDetailDate)
        val descriptionTextView: TextView = findViewById(R.id.sermonDetailDescription)
        val webView: WebView = findViewById(R.id.youtubeWebView)

        titleTextView.text = title
        speakerTextView.text = speaker
        dateTextView.text = date
        descriptionTextView.text = description

        if (youtubeId != null) {
            setupWebView(webView, youtubeId)
        }
    }

    private fun setupWebView(webView: WebView, youtubeId: String) {
        webView.settings.javaScriptEnabled = true
        webView.settings.loadWithOverviewMode = true
        webView.settings.useWideViewPort = true

        val html = """
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;overflow:hidden;">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/$youtubeId?playsinline=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </body>
            </html>
        """.trimIndent()
        webView.loadData(html, "text/html", "utf-8")
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                onBackPressedDispatcher.onBackPressed()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
