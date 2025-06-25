package com.holyspiritconnect.hscapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.holyspiritconnect.hscapp.courses.CoursesFragment
import com.holyspiritconnect.hscapp.databinding.ActivityHomeBinding
import com.holyspiritconnect.hscapp.events.EventsFragment
import com.holyspiritconnect.hscapp.partner.PartnerFragment
import com.holyspiritconnect.hscapp.sermons.SermonsFragment

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding

    private val onNavigationItemSelectedListener =
        BottomNavigationView.OnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    replaceFragment(HomeFragment())
                    return@OnNavigationItemSelectedListener true
                }
                R.id.nav_sermons -> {
                    replaceFragment(SermonsFragment())
                    return@OnNavigationItemSelectedListener true
                }
                R.id.nav_courses -> {
                    replaceFragment(CoursesFragment())
                    return@OnNavigationItemSelectedListener true
                }
                R.id.nav_events -> {
                    replaceFragment(EventsFragment())
                    return@OnNavigationItemSelectedListener true
                }
                R.id.nav_partner -> {
                    replaceFragment(PartnerFragment())
                    return@OnNavigationItemSelectedListener true
                }
            }
            false
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNavigation.setOnNavigationItemSelectedListener(onNavigationItemSelectedListener)

        if (savedInstanceState == null) {
            binding.bottomNavigation.selectedItemId = R.id.nav_home
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
