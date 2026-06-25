from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.db.session import get_db_session
from app.repositories.users import UserRepository

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, session: Session = Depends(get_db_session)) -> LoginResponse:
    user = UserRepository(session).find_by_username_or_email(payload.username)
    if user is None or not user.is_active or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return LoginResponse(
        access_token=create_access_token(user.id),
        user_id=user.id,
        username=user.username,
    )
