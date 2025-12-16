from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


# 1. AUTHENTICATION (Input Data)


class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    user_type: str  
    name: str       
    phone: str
    
    address1: Optional[str] = None
    address2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None

# --- NEW: REQUEST EMAIL (Used for both Temp Pass and OTP) ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# --- NEW: VERIFY OTP AND RESET (Used for Option 2) ---
class VerifyResetOTP(BaseModel):
    email: EmailStr
    otp: str          # The 8-digit code
    new_password: str # The new password user wants to set


# 2. OUTPUT RESPONSES 

class PartyResponse(BaseModel):
    PTY_ID: int
    PTY_Name: str
    PTY_Type: str
    model_config = ConfigDict(from_attributes=True)



# 3. SCHOOL REQUEST SCHEMAS


class RequestCreate(BaseModel):
    user_id: int
    item_name: str
    quantity: int

class RequestResponse(BaseModel):
    ITR_ID: int
    ITR_ItemName: str
    ITR_Quantity: int
    ITR_PendingQuantity: int
    ITR_CreateDate: datetime
    match_name: Optional[str] = None 
    model_config = ConfigDict(from_attributes=True)



# 4. COMPANY DONATION SCHEMAS


class DonationCreate(BaseModel):
    user_id: int
    item_name: str
    quantity: int

class DonationResponse(BaseModel):
    ITD_ID: int
    ITD_ItemName: str
    ITD_Quantity: int
    ITD_PendingQuantity: int
    ITD_CreateDate: datetime
    match_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)



# 5. TRANSACTION SCHEMA


class TransactionCreate(BaseModel):
    request_id: int
    donation_id: int
    quantity: int