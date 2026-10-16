import uuid
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.app.config import settings
from backend.app.routes.cases import router as cases_router
from backend.app.routes.health import router as health_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Autonomous Customer Support Investigation & Case Intelligence Platform API",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # 1. CORS Configuration for Local Frontend Origin
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # 2. Consistent Error Handling
    @app.exception_handler(HTTPException)
    async def custom_http_exception_handler(request: Request, exc: HTTPException):
        trace_id = request.headers.get("X-Trace-ID", f"tr-{uuid.uuid4().hex[:8]}")
        detail = exc.detail
        if isinstance(detail, dict):
            code = detail.get("code", "HTTP_ERROR")
            message = detail.get("message", "An HTTP error occurred")
            details = [detail]
        else:
            code = f"ERR_{exc.status_code}"
            message = str(detail)
            details = None

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": code,
                    "message": message,
                    "trace_id": trace_id,
                    "details": details,
                }
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        trace_id = request.headers.get("X-Trace-ID", f"tr-{uuid.uuid4().hex[:8]}")
        errors = []
        for err in exc.errors():
            loc = ".".join(str(l) for l in err.get("loc", []))
            errors.append({"field": loc, "issue": err.get("msg", "Validation error")})

        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "The request payload failed schema validation.",
                    "trace_id": trace_id,
                    "details": errors,
                }
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        trace_id = request.headers.get("X-Trace-ID", f"tr-{uuid.uuid4().hex[:8]}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred while processing the investigation request.",
                    "trace_id": trace_id,
                }
            },
        )

    # 3. Mount Route Modules
    app.include_router(health_router)
    app.include_router(cases_router, prefix="/api")
    # Alias /api/v1 as well for API contract compatibility
    app.include_router(cases_router, prefix="/api/v1")

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
