import subprocess
import sys
import os
from pathlib import Path


def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])


def download_spacy_model():
    """Download spaCy model"""
    print("🔧 Downloading spaCy model...")

    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install",
            "https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1.tar.gz"
        ])
        print("✅ spaCy model installed successfully!\n")
    except subprocess.CalledProcessError as e:
        print(f"❌ spaCy model download failed: {e}")
        sys.exit(1)



def create_directories():
    """Create necessary directories"""
    print("📁 Creating directories...")
    directories = [
        "model_cache/medgemma",
        "model_cache/medsiglip",
        "datasets",
        "static"
    ]

    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created {directory}")


def main():
    """Main setup function"""
    print("🚀 Setting up Medical Chatbot with AI Models...")

    try:
        install_requirements()
        download_spacy_model()
        create_directories()

        print("\n✅ Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Place your dialogues.parquet file in the datasets/ directory")
        print("2. Run: python main.py")
        print("3. Access the API at http://localhost:8000")
        print("4. Check API docs at http://localhost:8000/docs")

    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()