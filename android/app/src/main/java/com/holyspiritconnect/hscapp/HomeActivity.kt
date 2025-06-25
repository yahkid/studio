
package com.holyspiritconnect.hscapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.holyspiritconnect.hscapp.courses.CoursesFragment
import com.holyspiritconnect.hscapp.events.EventsFragment
import com.holyspiritconnect.hscapp.partner.PartnerFragment
import com.holyspiritconnect.hscapp.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        val bottomNavigation: BottomNavigationView = findViewById(R.id.bottom_navigation)

        // Set the default fragment
        if (savedInstanceState == null) {
            supportFragmentManager.beginTransaction()
                .replace(R.id.fragment_container, HomeFragment())
                .commit()
        }

        bottomNavigation.setOnItemSelectedListener { item ->
            var selectedFragment: Fragment? = null
            when (item.itemId) {
                R.id.nav_home -> selectedFragment = HomeFragment()
                R.id.nav_sermons -> selectedFragment = SermonsFragment()
                R.id.nav_courses -> selectedFragment = CoursesFragment()
                R.id.nav_events -> selectedFragment = EventsFragment()
                R.id.nav_partner -> selectedFragment = PartnerFragment()
            }
            if (selectedFragment != null) {
                supportFragmentManager.beginTransaction()
                    .replace(R.id.fragment_container, selectedFragment)
                    .commit()
            }
            true
        }
    }
}
