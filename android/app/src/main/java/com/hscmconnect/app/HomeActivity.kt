package com.hscmconnect.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.hscmconnect.app.courses.CoursesFragment
import com.hscmconnect.app.events.EventsFragment
import com.hscmconnect.app.partner.PartnerFragment
import com.hscmconnect.app.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {

    private lateinit var bottomNav: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        bottomNav = findViewById(R.id.bottom_navigation)

        // Set initial fragment
        if (savedInstanceState == null) {
            loadFragment(HomeFragment())
        }

        bottomNav.setOnItemSelectedListener { item ->
            val fragment: Fragment = when (item.itemId) {
                R.id.nav_home -> HomeFragment()
                R.id.nav_sermons -> SermonsFragment()
                R.id.nav_courses -> CoursesFragment()
                R.id.nav_events -> EventsFragment()
                R.id.nav_partner -> PartnerFragment()
                else -> HomeFragment()
            }
            loadFragment(fragment)
            true
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
