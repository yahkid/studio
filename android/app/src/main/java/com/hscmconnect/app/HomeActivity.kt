
package com.hscmconnect.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.hscmconnect.app.courses.CoursesFragment
import com.hscmconnect.app.events.EventsFragment
import com.hscmconnect.app.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val bottomNavigation: BottomNavigationView = findViewById(R.id.bottom_navigation)

        // Set the default fragment
        if (savedInstanceState == null) {
            loadFragment(HomeFragment())
        }

        bottomNavigation.setOnItemSelectedListener { item ->
            var selectedFragment: Fragment? = null
            when (item.itemId) {
                R.id.nav_home -> selectedFragment = HomeFragment()
                R.id.nav_sermons -> selectedFragment = SermonsFragment()
                R.id.nav_courses -> selectedFragment = CoursesFragment()
                R.id.nav_events -> selectedFragment = EventsFragment()
                R.id.nav_partner -> {
                    // TODO: Implement PartnerFragment or Activity
                }
            }
            if (selectedFragment != null) {
                loadFragment(selectedFragment)
            }
            true
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
