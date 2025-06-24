package com.hscmconnect.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.Firebase
import com.google.firebase.analytics.analytics

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Example of using Firebase Analytics
        Firebase.analytics.logEvent("screen_view", Bundle().apply {
            putString("screen_name", "MainActivity")
            putString("screen_class", "MainActivity")
        })
        
        // Your layout file would be set here, e.g.:
        // setContentView(R.layout.activity_main)
    }
}
