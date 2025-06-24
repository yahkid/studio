
package com.hscmconnect.app

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment

class PartnerFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val textView = TextView(activity)
        textView.text = "Partner Fragment (Coming Soon)"
        textView.gravity = android.view.Gravity.CENTER
        return textView
    }
}
