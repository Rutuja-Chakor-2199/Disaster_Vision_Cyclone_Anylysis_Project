from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
from app.utils.logger import logger

class DisasterVisionException(Exception):
    """Base exception for Disaster Vision application"""
    def __init__(self, message: str, error_code: str = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

class ExternalAPIException(DisasterVisionException):
    """Exception for external API failures"""
    def __init__(self, api_name: str, message: str):
        super().__init__(f"External API {api_name} error: {message}")
        self.api_name = api_name

class MLPredictionException(DisasterVisionException):
    """Exception for ML model prediction failures"""
    def __init__(self, message: str):
        super().__init__(f"ML prediction error: {message}")

class ValidationException(DisasterVisionException):
    """Exception for data validation failures"""
    def __init__(self, message: str):
        super().__init__(f"Validation error: {message}")

async def disaster_vision_exception_handler(request: Request, exc: DisasterVisionException):
    """Global exception handler for custom exceptions"""
    logger.error(
        "Application error",
        error_type=type(exc).__name__,
        message=exc.message,
        error_code=exc.error_code,
        path=request.url.path
    )
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": exc.message,
            "error_code": exc.error_code,
            "type": type(exc).__name__
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for FastAPI validation errors"""
    logger.error(
        "Validation error",
        errors=exc.errors(),
        path=request.url.path
    )
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Invalid request data",
            "details": exc.errors()
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handler for HTTP exceptions"""
    logger.warning(
        "HTTP exception",
        status_code=exc.status_code,
        detail=exc.detail,
        path=request.url.path
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )
