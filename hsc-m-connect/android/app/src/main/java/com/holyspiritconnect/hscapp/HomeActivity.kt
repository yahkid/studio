package com.holyspiritconnect.hscapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.holyspiritconnect.hscapp.courses.CoursesFragment
import com.holyspiritconnect.hscapp.events.EventsFragment
import com.holyspiritconnect.hscapp.partner.PartnerFragment
import com.holyspiritconnect.hscapp.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {

    private lateinit var bottomNavigationView: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        bottomNavigationView = findViewById(R.id.bottom_navigation)

        bottomNavigationView.setOnItemSelectedListener { item ->
            var selectedFragment: Fragment? = null
            when (item.itemId) {
                R.id.nav_home -> selectedFragment = HomeFragment()
                R.id.nav_sermons -> selectedFragment = SermonsFragment()
                R.id.nav_courses -> selectedFragment = CoursesFragment()
                R.id.nav_events -> selectedFragment = EventsFragment()
                R.id.nav_partner -> selectedFragment = PartnerFragment()
            }
            if (selectedFragment != null) {
                supportFragmentManager.beginTransaction().replace(R.id.fragment_container, selectedFragment).commit()
            }
            true
        }

        // Set default fragment
        if (savedInstanceState == null) {
            bottomNavigationView.selectedItemId = R.id.nav_home
        }
    }

    fun navigateToEvents() {
        bottomNavigationView.selectedItemId = R.id.nav_events
    }
}
