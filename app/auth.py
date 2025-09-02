from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "supersecret"
ALGORİTHM = "HS256"
ACCESS_TOKEN_EXPIRE_MUNITES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORİTHM)


def verify_token(token: str):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORİTHM])
        return payload
    except JWTError:
        return None