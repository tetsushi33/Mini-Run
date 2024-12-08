from flask import request, current_app
from functools import wraps

def http_request_logging(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger = current_app.logger
        try:
            logger.info('%s - %s - %s - %s', request.remote_addr, request.method, request.url, request.query_string)
        except Exception as e:
            logger.exception(e)
            pass
        return f(*args, **kwargs)
    return decorated_function
