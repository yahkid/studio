package com.hscmconnect.app

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.hscmconnect.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.loginButton.setOnClickListener {
            val email = binding.emailEditText.text.toString()
            val password = binding.passwordEditText.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                // Placeholder for actual login logic with Firebase Auth
                Toast.makeText(this, "Logging in with email: $email", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
            }
        }

        binding.signUpTextView.setOnClickListener {
            // Placeholder for navigation to a sign-up screen
            Toast.makeText(this, "Navigate to Sign Up Screen", Toast.LENGTH_SHORT).show()
        }

        binding.forgotPasswordTextView.setOnClickListener {
            // Placeholder for forgot password flow
            Toast.makeText(this, "Navigate to Forgot Password Screen", Toast.LENGTH_SHORT).show()
        }
    }
}
