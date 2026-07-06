from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models import User
from app.auth import hash_password, verify_password, create_access_token


class AuthService:

    @staticmethod
    def register(db: Session, user_data):
        existing_user = db.query(User).filter(
            User.email == user_data.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role=user_data.role,
            is_approved=0 if user_data.role.value == "vendor" else 1
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token({
            "user_id": new_user.id,
            "role": new_user.role.value
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": new_user
        }

    @staticmethod
    def login(db: Session, login_data):
        user = db.query(User).filter(
            User.email == login_data.email
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        token = create_access_token({
            "user_id": user.id,
            "role": user.role.value
        })

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user
        }