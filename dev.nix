{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Core development tools
    nodejs_22
    python3
    git
    curl
    wget
    unzip
    
    # Java development (for Advanced Java Scripting class)
    jdk17
    maven
    gradle
    
    # Firebase and cloud tools
    firebase-tools
    google-cloud-sdk
    
    # Python packages for ML and hardware detection
    (python3.withPackages (ps: with ps; [
      requests
      numpy
      pandas
      tensorflow
      torch
      scikit-learn
      matplotlib
      plotly
      jupyter
      psutil
      pyserial
      opencv4
      pillow
    ]))
    
    # Database tools
    sqlite
    postgresql
    
    # Build tools
    gnumake
    gcc
    
    # Nix development
    nixfmt
    
    # Additional utilities
    jq
    tree
    htop
  ];

  shellHook = ''
    echo "🚀 Axiom Development Environment"
    echo "================================"
    echo "📱 Node.js: $(node --version)"
    echo "🐍 Python: $(python --version)"
    echo "☕ Java: $(java -version 2>&1 | head -n 1)"
    echo "🔥 Firebase: $(firebase --version)"
    echo ""
    echo "Available commands:"
    echo "  npm run dev          - Start Next.js development server"
    echo "  firebase serve       - Start Firebase emulators"
    echo "  python axiom.py      - Run Python Axiom ecosystem"
    echo "  mvn compile          - Compile Java components"
    echo ""
    echo "Project structure ready for:"
    echo "  • Web Scripting (JavaScript/Node.js)"
    echo "  • Advanced Java Scripting"
    echo "  • Firebase integration"
    echo "  • AI/ML development"
    echo ""
    
    # Set environment variables
    export FIREBASE_PROJECT_ID="axiom-ecosystem"
    export NODE_ENV="development"
    export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/application_default_credentials.json"
    
    # Verify Firebase authentication
    if ! firebase projects:list >/dev/null 2>&1; then
      echo "⚠️  Firebase not authenticated. Run: firebase login"
    else
      echo "✅ Firebase authenticated"
    fi
    
    # Check Java setup
    if command -v java >/dev/null 2>&1 && command -v mvn >/dev/null 2>&1; then
      echo "✅ Java development environment ready"
    else
      echo "⚠️  Java tools not available"
    fi
    
    echo ""
  '';

  # Set environment variables
  FIREBASE_PROJECT_ID = "axiom-ecosystem";
  NODE_ENV = "development";
}
