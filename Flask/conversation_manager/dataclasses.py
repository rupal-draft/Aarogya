from enum import Enum
from dataclasses import dataclass
from typing import List, Optional


class SeverityLevel(Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"


class UrgencyLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"


@dataclass
class SymptomDetail:
    name: str
    severity: Optional[int] = None
    duration: Optional[str] = None
    frequency: Optional[str] = None
    triggers: List[str] = None
    relievers: List[str] = None
    location: Optional[str] = None
    quality: Optional[str] = None

    def __post_init__(self):
        if self.triggers is None:
            self.triggers = []
        if self.relievers is None:
            self.relievers = []