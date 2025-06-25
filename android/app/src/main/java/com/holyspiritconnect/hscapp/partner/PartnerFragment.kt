package com.holyspiritconnect.hscapp.partner

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.holyspiritconnect.hscapp.databinding.FragmentPartnerBinding

class PartnerFragment : Fragment() {

    private var _binding: FragmentPartnerBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentPartnerBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.giveOnlineButton.setOnClickListener {
            // In a real-world app, you would integrate a native payment SDK.
            // For now, we will open the website's partner page in a browser.
            val partnerUrl = "https://hsc-website-d7569.web.app/partner" 
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(partnerUrl))
            startActivity(intent)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
