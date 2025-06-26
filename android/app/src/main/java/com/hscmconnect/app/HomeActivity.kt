package com.hscmconnect.app

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.hscmconnect.app.courses.CoursesFragment
import com.hscmconnect.app.events.EventsFragment
import com.hscmconnect.app.partner.PartnerFragment
import com.hscmconnect.app.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val bottomNavigation: BottomNavigationView = findViewById(R.id.bottom_navigation)
        bottomNavigation.setOnNavigationItemSelectedListener(navListener)

        // Load the default fragment
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction().replace(R.id.fragment_container, HomeFragment()).commit()
            bottomNavigation.selectedItemId = R.id.nav_home
        }
    }

    private val navListener = BottomNavigationView.OnNavigationItemSelectedListener { item ->
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
            return@OnNavigationItemSelectedListener true
        }
        false
    }
}
