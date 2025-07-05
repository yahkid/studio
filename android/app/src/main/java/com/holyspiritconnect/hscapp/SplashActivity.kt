package com.holyspiritconnect.hscapp

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth

class SplashActivity : AppCompatActivity() {
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        auth = FirebaseAuth.getInstance()

        // The splash screen's background is set by the theme in AndroidManifest.xml
        // No need to set a content view here.

        // Use a Handler to delay the transition to the next activity.
        // This gives the user a moment to see the splash screen.
        Handler(Looper.getMainLooper()).postDelayed({
            // Check if a user is currently signed in
            val currentUser = auth.currentUser
            if (currentUser != null) {
                // If user is signed in, navigate to the HomeActivity
                startActivity(Intent(this, HomeActivity::class.java))
            } else {
                // If no user is signed in, navigate to the MainActivity (Login screen)
                startActivity(Intent(this, MainActivity::class.java))
            }

            // Finish the SplashActivity so the user can't navigate back to it
            finish()
        }, 1500) // 1.5-second delay
    }
}
