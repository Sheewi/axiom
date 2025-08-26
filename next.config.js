const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: (config) => {
    // Custom webpack configuration if needed
    return config;
  },
  // Environment variables for Firebase
  env: {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'axiom-ecosystem',
  },
}

module.exports = nextConfig
