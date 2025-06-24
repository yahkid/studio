
package com.hscmconnect.app

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.auth.FirebaseAuth

class HomeActivity : AppCompatActivity() {

    private lateinit var auth: FirebaseAuth
    private lateinit var homeContentTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        auth = FirebaseAuth.getInstance()
        homeContentTextView = findViewById(R.id.home_content)

        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation)

        bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    homeContentTextView.text = "Home Content"
                    true
                }
                R.id.nav_sermons -> {
                    homeContentTextView.text = "Sermons Content"
                    true
                }
                R.id.nav_courses -> {
                    homeContentTextView.text = "Courses Content"
                    true
                }
                R.id.nav_events -> {
                    homeContentTextView.text = "Events Content"
                    true
                }
                R.id.nav_partner -> {
                    homeContentTextView.text = "Partner Content"
                    true
                }
                else -> false
            }
        }

        // Set default selection
        bottomNavigationView.selectedItemId = R.id.nav_home

        // The logout button is no longer on this main layout.
        // It will be moved to a profile screen later.
    }
}
