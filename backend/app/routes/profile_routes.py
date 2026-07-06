from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.models import User
from app.auth import hash_password, verify_password
from pydantic import BaseModel


router = APIRouter(prefix="/profile", tags=["Profile"])


class ProfileUpdate(BaseModel):
    name: str


class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str


@router.get("/me")
def get_my_profile(
    current_user: User = Depends(require_role(["customer", "vendor", "admin"]))
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_approved": current_user.is_approved
    }


@router.put("/me")
def update_my_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer", "vendor", "admin"]))
):
    current_user.name = profile_data.name

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "role": current_user.role,
            "is_approved": current_user.is_approved
        }
    }


@router.put("/change-password")
def change_password(
    password_data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["customer", "vendor", "admin"]))
):
    if not verify_password(password_data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    current_user.password_hash = hash_password(password_data.new_password)

    db.commit()

    return {"message": "Password changed successfully"}