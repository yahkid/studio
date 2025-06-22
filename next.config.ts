
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
      }
    ],
  },
};

export default nextConfig;
