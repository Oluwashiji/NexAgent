"""
Auth endpoints: signup and login.

Signup: create a new business account, with the password hashed before
it ever touches the database.

Login: check the submitted password against the stored hash. If it
matches, issue a JWT token - the "wristband" the frontend will attach
to every future request to prove who's asking.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.models.user import User

router = APIRouter()


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    business_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/auth/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    new_user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
        business_name=request.business_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(user_id=str(new_user.id))
    return AuthResponse(access_token=token)


@router.post("/auth/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    # Deliberately vague error message - don't reveal whether the email
    # exists or the password was wrong, which would help an attacker
    # narrow down valid accounts.
    invalid_credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password.",
    )

    if not user:
        raise invalid_credentials_error
    if not verify_password(request.password, user.hashed_password):
        raise invalid_credentials_error

    token = create_access_token(user_id=str(user.id))
    return AuthResponse(access_token=token)

    class MeResponse(BaseModel):
    id: str
    email: str
    business_name: str | None = None


@router.get("/auth/me", response_model=MeResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Lets the frontend ask "who am I?" using just the token - no need to
    re-send a password. Used to show the logged-in business's name/email
    in the dashboard, and to get their id for things like the embed code.
    """
    return MeResponse(
        id=str(current_user.id),
        email=current_user.email,
        business_name=current_user.business_name,
    )