import pickle
import pandas as pd
import os
import hashlib
from typing import Dict, Any, Optional
import logging
from pathlib import Path

logger = logging.getLogger(__name__)


class CacheManager:
    """Manages caching of processed data to avoid reprocessing"""

    def __init__(self, cache_dir: str = "cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)

    def _get_cache_key(self, df_path: str, config_hash: str) -> str:
        """Generate unique cache key based on dataset and processing configuration"""
        key_string = f"{df_path}_{config_hash}"
        return hashlib.md5(key_string.encode()).hexdigest()

    def _get_config_hash(self) -> str:
        """Generate hash of processing configuration"""
        config = {
            "tfidf_features": 10000,  # Include your actual config parameters
            "ngram_range": (1, 2),
            "processing_version": "1.0"  # Change this if processing logic changes
        }
        return hashlib.md5(str(config).encode()).hexdigest()

    def save_processed_data(self, df: pd.DataFrame, vectorizer, knowledge_base,
                            symptom_patterns, df_path: str) -> bool:
        """Save processed data to cache"""
        try:
            cache_key = self._get_cache_key(df_path, self._get_config_hash())
            cache_file = self.cache_dir / f"{cache_key}.pkl"

            cache_data = {
                'processed_df': df,
                'vectorizer': vectorizer,
                'knowledge_base': knowledge_base,
                'symptom_patterns': symptom_patterns,
                'config_hash': self._get_config_hash(),
                'source_path': df_path
            }

            with open(cache_file, 'wb') as f:
                pickle.dump(cache_data, f)

            logger.info(f"✅ Processed data cached to {cache_file}")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to cache data: {e}")
            return False

    def load_processed_data(self, df_path: str) -> Optional[Dict[str, Any]]:
        """Load processed data from cache"""
        try:
            cache_key = self._get_cache_key(df_path, self._get_config_hash())
            cache_file = self.cache_dir / f"{cache_key}.pkl"

            if not cache_file.exists():
                logger.info("❌ No cached data found")
                return None

            with open(cache_file, 'rb') as f:
                cache_data = pickle.load(f)

            # Verify cache integrity
            if (cache_data.get('config_hash') != self._get_config_hash() or
                    cache_data.get('source_path') != df_path):
                logger.warning("⚠️ Cache invalidated due to configuration change")
                return None

            logger.info("✅ Loaded processed data from cache")
            return cache_data

        except Exception as e:
            logger.error(f"❌ Failed to load cached data: {e}")
            return None

    def clear_cache(self) -> bool:
        """Clear all cached data"""
        try:
            for cache_file in self.cache_dir.glob("*.pkl"):
                cache_file.unlink()
            logger.info("✅ Cache cleared")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to clear cache: {e}")
            return False

    def get_cache_info(self) -> Dict[str, Any]:
        """Get information about cached data"""
        cache_files = list(self.cache_dir.glob("*.pkl"))
        return {
            "cache_dir": str(self.cache_dir),
            "cache_files_count": len(cache_files),
            "cache_files": [f.name for f in cache_files],
            "total_size_mb": sum(f.stat().st_size for f in cache_files) / (1024 * 1024)
        }