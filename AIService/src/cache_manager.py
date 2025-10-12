import pickle
import pandas as pd
import os
import hashlib
from typing import Dict, Any, Optional
import logging
from pathlib import Path
import json
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class CacheManager:
    """Enhanced cache manager for comprehensive medical data"""

    def __init__(self, cache_dir: str = "cache", max_cache_size_mb: int = 500):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.max_cache_size_mb = max_cache_size_mb
        self.cache_metadata_file = self.cache_dir / "cache_metadata.json"
        self._load_cache_metadata()

    def _load_cache_metadata(self):
        """Load cache metadata"""
        if self.cache_metadata_file.exists():
            try:
                with open(self.cache_metadata_file, 'r') as f:
                    self.cache_metadata = json.load(f)
            except Exception as e:
                logger.error(f"❌ Failed to load cache metadata: {e}")
                self.cache_metadata = {}
        else:
            self.cache_metadata = {}

    def _save_cache_metadata(self):
        """Save cache metadata"""
        try:
            with open(self.cache_metadata_file, 'w') as f:
                json.dump(self.cache_metadata, f, indent=2)
        except Exception as e:
            logger.error(f"❌ Failed to save cache metadata: {e}")

    def _get_cache_key(self, df_path: str, config_hash: str) -> str:
        """Generate unique cache key based on dataset and processing configuration"""
        key_string = f"{df_path}_{config_hash}"
        return hashlib.md5(key_string.encode()).hexdigest()

    def _get_config_hash(self) -> str:
        """Generate hash of processing configuration including medical database version"""
        config = {
            "tfidf_features": 10000,
            "ngram_range": (1, 2),
            "processing_version": "2.0",  # Updated for comprehensive analysis
            "medical_db_version": "comprehensive_v1",
            "text_processor_version": "enhanced_v1",
            "cache_version": "1.1"
        }
        return hashlib.md5(str(config).encode()).hexdigest()

    def _manage_cache_size(self):
        """Manage cache size by removing oldest files if limit exceeded"""
        cache_files = list(self.cache_dir.glob("*.pkl"))
        if not cache_files:
            return

        # Calculate total cache size
        total_size = sum(f.stat().st_size for f in cache_files) / (1024 * 1024)  # MB

        if total_size > self.max_cache_size_mb:
            logger.info(f"📦 Cache size ({total_size:.1f}MB) exceeds limit ({self.max_cache_size_mb}MB), cleaning...")

            # Sort files by last access time (oldest first)
            files_with_mtime = [(f, f.stat().st_mtime) for f in cache_files]
            files_with_mtime.sort(key=lambda x: x[1])

            # Remove oldest files until under limit
            removed_size = 0
            for file_path, _ in files_with_mtime:
                file_size = file_path.stat().st_size / (1024 * 1024)
                try:
                    file_path.unlink()
                    removed_size += file_size
                    logger.info(f"🗑️ Removed cache file: {file_path.name} ({file_size:.1f}MB)")

                    # Remove from metadata
                    cache_key = file_path.stem
                    if cache_key in self.cache_metadata:
                        del self.cache_metadata[cache_key]

                    if (total_size - removed_size) <= self.max_cache_size_mb:
                        break

                except Exception as e:
                    logger.error(f"❌ Failed to remove cache file {file_path}: {e}")

            self._save_cache_metadata()
            logger.info(f"✅ Cache cleaning completed. Removed {removed_size:.1f}MB")

    def save_processed_data(self, df: pd.DataFrame, vectorizer, knowledge_base,
                            symptom_patterns, df_path: str) -> bool:
        """Save comprehensive processed data to cache"""
        try:
            cache_key = self._get_cache_key(df_path, self._get_config_hash())
            cache_file = self.cache_dir / f"{cache_key}.pkl"

            # Create comprehensive cache data
            cache_data = {
                'processed_df': df,
                'vectorizer': vectorizer,
                'knowledge_base': knowledge_base,
                'symptom_patterns': symptom_patterns,
                'config_hash': self._get_config_hash(),
                'source_path': df_path,
                'timestamp': datetime.now().isoformat(),
                'data_stats': {
                    'num_records': len(df),
                    'num_features': knowledge_base.shape[1] if knowledge_base is not None else 0,
                    'num_symptom_patterns': len(symptom_patterns) if symptom_patterns else 0,
                    'columns': list(df.columns) if df is not None else []
                }
            }

            with open(cache_file, 'wb') as f:
                pickle.dump(cache_data, f, protocol=pickle.HIGHEST_PROTOCOL)

            # Update metadata
            self.cache_metadata[cache_key] = {
                'source_path': df_path,
                'timestamp': datetime.now().isoformat(),
                'file_size_mb': cache_file.stat().st_size / (1024 * 1024),
                'data_stats': cache_data['data_stats']
            }
            self._save_cache_metadata()

            logger.info(f"✅ Comprehensive processed data cached to {cache_file}")
            logger.info(f"📊 Cache stats: {cache_data['data_stats']}")

            # Manage cache size
            self._manage_cache_size()

            return True

        except Exception as e:
            logger.error(f"❌ Failed to cache data: {e}")
            return False

    def load_processed_data(self, df_path: str) -> Optional[Dict[str, Any]]:
        """Load comprehensive processed data from cache"""
        try:
            cache_key = self._get_cache_key(df_path, self._get_config_hash())
            cache_file = self.cache_dir / f"{cache_key}.pkl"

            if not cache_file.exists():
                logger.info("❌ No cached data found for current configuration")
                return None

            # Check if cache is too old (e.g., older than 30 days)
            file_mtime = datetime.fromtimestamp(cache_file.stat().st_mtime)
            if datetime.now() - file_mtime > timedelta(days=30):
                logger.info("⚠️ Cache file is older than 30 days, considering refresh")
                # You might want to return None here to force refresh, or continue with cached data

            with open(cache_file, 'rb') as f:
                cache_data = pickle.load(f)

            # Verify cache integrity
            if (cache_data.get('config_hash') != self._get_config_hash() or
                    cache_data.get('source_path') != df_path):
                logger.warning("⚠️ Cache invalidated due to configuration change")
                return None

            # Update last accessed time in metadata
            if cache_key in self.cache_metadata:
                self.cache_metadata[cache_key]['last_accessed'] = datetime.now().isoformat()
                self._save_cache_metadata()

            logger.info("✅ Loaded comprehensive processed data from cache")
            logger.info(f"📊 Loaded data stats: {cache_data.get('data_stats', {})}")

            return cache_data

        except Exception as e:
            logger.error(f"❌ Failed to load cached data: {e}")
            return None

    def clear_cache(self, older_than_days: Optional[int] = None) -> bool:
        """Clear cache with optional age filter"""
        try:
            cache_files = list(self.cache_dir.glob("*.pkl"))
            removed_count = 0

            for cache_file in cache_files:
                should_remove = True

                if older_than_days:
                    file_mtime = datetime.fromtimestamp(cache_file.stat().st_mtime)
                    if datetime.now() - file_mtime <= timedelta(days=older_than_days):
                        should_remove = False

                if should_remove:
                    cache_file.unlink()
                    removed_count += 1

                    # Remove from metadata
                    cache_key = cache_file.stem
                    if cache_key in self.cache_metadata:
                        del self.cache_metadata[cache_key]

            self._save_cache_metadata()
            logger.info(f"✅ Cache cleared. Removed {removed_count} files")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to clear cache: {e}")
            return False

    def get_cache_info(self) -> Dict[str, Any]:
        """Get comprehensive information about cached data"""
        cache_files = list(self.cache_dir.glob("*.pkl"))
        total_size = sum(f.stat().st_size for f in cache_files) / (1024 * 1024)

        info = {
            "cache_dir": str(self.cache_dir),
            "cache_files_count": len(cache_files),
            "total_size_mb": total_size,
            "max_size_mb": self.max_cache_size_mb,
            "cache_usage_percentage": (total_size / self.max_cache_size_mb) * 100,
            "cache_entries": self.cache_metadata,
            "oldest_entry": min(
                [meta.get('timestamp', '') for meta in self.cache_metadata.values()]) if self.cache_metadata else None,
            "newest_entry": max(
                [meta.get('timestamp', '') for meta in self.cache_metadata.values()]) if self.cache_metadata else None
        }

        return info

    def backup_cache(self, backup_dir: str = "cache_backup") -> bool:
        """Create a backup of the cache"""
        try:
            backup_path = Path(backup_dir)
            backup_path.mkdir(exist_ok=True)

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = backup_path / f"cache_backup_{timestamp}.pkl"

            # Copy all cache files
            cache_files = list(self.cache_dir.glob("*.pkl"))
            backup_data = {
                'timestamp': timestamp,
                'cache_files': {},
                'metadata': self.cache_metadata
            }

            for cache_file in cache_files:
                with open(cache_file, 'rb') as f:
                    backup_data['cache_files'][cache_file.name] = f.read()

            with open(backup_file, 'wb') as f:
                pickle.dump(backup_data, f)

            logger.info(f"✅ Cache backed up to {backup_file}")
            return True

        except Exception as e:
            logger.error(f"❌ Failed to backup cache: {e}")
            return False