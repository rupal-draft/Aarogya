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


def download_dataset():
    """Download the dialogues.parquet dataset from Google Drive"""
    print("📥 Downloading dataset from Google Drive...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gdown"])
        import gdown

        # Google Drive file ID from your shared link
        file_id = "1gpSocknNMEYWkS7DVesbID7EjftfcOds"
        output_path = "datasets/dialogues.parquet"

        # Construct direct download URL
        url = f"https://drive.google.com/uc?id={file_id}"

        print(f"➡️  Downloading to: {output_path}")
        gdown.download(url, output_path, quiet=False)

        if os.path.exists(output_path):
            print("✅ Dataset downloaded successfully!\n")
        else:
            print("❌ Dataset download failed: file not found after download.")
            sys.exit(1)

    except Exception as e:
        print(f"❌ Dataset download failed: {e}")
        sys.exit(1)


def main():
    """Main setup function"""
    print("🚀 Setting up Medical Chatbot with AI Models...")

    try:
        install_requirements()
        download_spacy_model()
        create_directories()
        download_dataset()

        print("\n✅ Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Run: python main.py")
        print("2. Access the API at http://localhost:8000")
        print("3. Check API docs at http://localhost:8000/docs")

    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
