
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin', // Changed from same-origin-allow-popups to fix auth popups
          },
        ],
      },
    ];
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Added for Google profile pictures
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Added for Unsplash images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photos.app.goo.gl', // Added for Google Photos links
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com', // Added for Google Drive images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.buzzsprout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // For user-uploaded profile pictures
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
