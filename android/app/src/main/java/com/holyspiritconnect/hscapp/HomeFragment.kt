
package com.holyspiritconnect.hscapp

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.TextView
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser

class HomeFragment : Fragment() {

    private lateinit var auth: FirebaseAuth
    private var currentUser: FirebaseUser? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)
        auth = FirebaseAuth.getInstance()
        currentUser = auth.currentUser

        val welcomeTextView: TextView = view.findViewById(R.id.welcome_text)
        val progressBar: ProgressBar = view.findViewById(R.id.progressBar)

        progressBar.visibility = View.VISIBLE

        currentUser?.let { user ->
            val displayName = user.displayName
            if (!displayName.isNullOrEmpty()) {
                welcomeTextView.text = "Welcome, ${displayName.split(" ")[0]}!"
            } else {
                welcomeTextView.text = "Welcome!"
            }
        }
        
        // In a real app, you'd fetch data here and then hide the progress bar.
        // For now, we just hide it after setting the text.
        progressBar.visibility = View.GONE

        return view
    }
}
