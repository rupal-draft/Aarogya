from dataclasses import dataclass
from typing import Optional, Dict, Any

@dataclass
class MedGemmaConfig:
    model_name: str = "google/med-gemma-2b"
    cache_dir: str = "./model_cache/medgemma"
    torch_dtype: str = "bfloat16"
    device_map: str = "auto"
    max_length: int = 2048
    temperature: float = 0.7
    top_p: float = 0.9
    load_in_8bit: bool = True

@dataclass
class MedSigLIPConfig:
    model_name: str = "google/siglip2-so400m-14-896-pt"
    cache_dir: str = "./model_cache/medsiglip"
    device_map: str = "auto"
    image_size: int = 896

@dataclass
class ModelConfig:
    medgemma: MedGemmaConfig = MedGemmaConfig()
    medsiglip: MedSigLIPConfig = MedSigLIPConfig()
    enable_image_analysis: bool = True
    enable_text_generation: bool = True
    max_retries: int = 3
    timeout: int = 30