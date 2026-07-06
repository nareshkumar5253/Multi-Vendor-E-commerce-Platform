import time
import logging

logger = logging.getLogger("api")


async def log_requests(request, call_next):

    start = time.time()

    response = await call_next(request)

    process_time = time.time() - start

    logger.info(
        f"{request.method} {request.url.path} {response.status_code} {process_time:.2f}s"
    )

    return response