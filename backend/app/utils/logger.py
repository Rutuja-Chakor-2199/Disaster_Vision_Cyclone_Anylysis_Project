import logging
import os
import sys
import structlog
from structlog import get_logger
from app.config import settings

# Configure structlog for structured logging
def setup_logging():
    """Setup structured logging configuration"""
    
    # Create logs directory if it doesn't exist
    log_dir = os.path.dirname(settings.LOG_FILE)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Configure standard logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, settings.LOG_LEVEL.upper())
    )
    
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

# Initialize logger
logger = get_logger()

def log_api_request(method: str, path: str, status_code: int = None, error: str = None):
    """Log API request with relevant context"""
    log_data = {
        "event": "api_request",
        "method": method,
        "path": path,
        "status_code": status_code,
    }
    
    if error:
        log_data["error"] = error
        logger.error("API request failed", **log_data)
    else:
        logger.info("API request completed", **log_data)

def log_ml_prediction(windspeed: float, pressure: float, risk: str, error: str = None):
    """Log ML prediction attempts"""
    log_data = {
        "event": "ml_prediction",
        "windspeed": windspeed,
        "pressure": pressure,
        "predicted_risk": risk,
    }
    
    if error:
        log_data["error"] = error
        logger.error("ML prediction failed", **log_data)
    else:
        logger.info("ML prediction completed", **log_data)
