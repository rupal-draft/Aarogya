from fastapi import APIRouter, HTTPException

from configs.settings import DATA_PATH
from src.api.chat_endpoints import chatbot
from src.cache_manager import CacheManager

cache_manager = CacheManager()

router = APIRouter()

@router.get("/cache/info")
async def get_cache_info():
    return cache_manager.get_cache_info()


@router.post("/cache/clear")
async def clear_cache():
    success = cache_manager.clear_cache()
    if success:
        return {"message": "Cache cleared successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to clear cache")


@router.get("/cache/status")
async def cache_status():
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    cache_data = cache_manager.load_processed_data(DATA_PATH)
    return {
        "cached_data_available": cache_data is not None,
        "cache_info": cache_manager.get_cache_info()
    }