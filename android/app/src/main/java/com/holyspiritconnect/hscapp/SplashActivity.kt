package com.holyspiritconnect.hscapp

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.auth.FirebaseAuth

@SuppressLint("CustomSplashScreen")
class SplashActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // No need to set content view for a simple splash logic activity

        auth = FirebaseAuth.getInstance()

        // Check if user is signed in (non-null) and update UI accordingly.
        if (auth.currentUser != null) {
            // User is signed in, go to HomeActivity
            startActivity(Intent(this, HomeActivity::class.java))
        } else {
            // No user is signed in, go to MainActivity (Login)
            startActivity(Intent(this, MainActivity::class.java))
        }

        // Finish this activity so the user can't navigate back to it
        finish()
    }
}
