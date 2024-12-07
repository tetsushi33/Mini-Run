import os
from dataclasses import dataclass

@dataclass
class Config:
    DEBUG = os.getenv("DEBUG")
    DATABASE_URI= ""
