from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import random
import string
from datetime import datetime, timedelta

from pydantic import EmailStr, BaseModel
# plus your other imports...
# --- NEW IMPORTS FOR EMAIL ---
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

# Import our own files
from . import models, schemas, crud
from .database import SessionLocal, engine

# ==========================================
# 1. SETUP & CONFIGURATION
# ==========================================

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 2. EMAIL CONFIGURATION (IMPORTANT)
# ==========================================

# Replace these with your real details later to actually send emails.
# For now, SUPPRESS_SEND=1 means it won't actually send, just log.
conf = ConnectionConfig(
    MAIL_USERNAME = "b22cs078@kitsw.ac.in",
    MAIL_PASSWORD = "romg zmwv qfhf qyll",
    MAIL_FROM = "b22cs078@kitsw.ac.in",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

async def send_email_async(subject: str, email_to: str, body: str):
    # 1. Define the message
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype=MessageType.html
    )

    # 2. Connect and Send (The Real Deal)
    fm = FastMail(conf)
    await fm.send_message(message)
    
    print(f"✅ Email sent successfully to {email_to}")
    
    # Uncomment lines below when you have real credentials
    # message = MessageSchema(
    #     subject=subject,
    #     recipients=[email_to],
    #     body=body,
    #     subtype=MessageType.html
    # )
    # fm = FastMail(conf)
    # await fm.send_message(message)


# ==========================================
# 3. AUTHENTICATION & PASSWORD LOGIC
# ==========================================

@app.post("/signup", response_model=schemas.PartyResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_party(db=db, user=user)

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    # Check Password
    if db_user.ULN_Password != user.password:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    party = db_user.party
    if not party:
        party = db.query(models.Party).filter(models.Party.ULN_ID == db_user.ULN_ID).first()
        if not party:
             raise HTTPException(status_code=500, detail="User profile corrupted (No Party ID)")

    return {
        "message": "Login Successful",
        "user_id": db_user.ULN_ID,
        "party_id": party.PTY_ID,
        "name": party.PTY_Name,
        "type": party.PTY_Type
    }

# --- OPTION 1: GENERATE TEMP PASSWORD ---
@app.post("/forgot-password/temp")
async def forgot_password_temp(
    request: schemas.ForgotPasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # 1. Check if user exists
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # 2. Generate Temp Password (Random 8 chars)
    temp_pass = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

    # 3. SAVE to Database immediately (So they can log in)
    user.ULN_Password = temp_pass
    db.commit()

    # 4. Send Email (Mocked)
    email_body = f"Hello, your temporary password is: <b>{temp_pass}</b>. Please login and change it."
    background_tasks.add_task(send_email_async, "Your Temporary Password", request.email, email_body)

    return {"message": "Temporary password generated and sent to email."}


# --- OPTION 2 STEP A: GENERATE OTP ---
@app.post("/forgot-password/otp")
async def forgot_password_otp(
    request: schemas.ForgotPasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # 1. Check if user exists
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # 2. Generate 8-digit OTP
    otp_code = ''.join(random.choices(string.digits, k=8))

    # 3. Save OTP to DB with Expiry (15 mins from now)
    user.ULN_ResetOTP = otp_code
    user.ULN_OTPExpiry = datetime.utcnow() + timedelta(minutes=15)
    db.commit()

    # 4. Send Email (Mocked)
    email_body = f"Hello, your reset code is: <b>{otp_code}</b>. It expires in 15 minutes."
    background_tasks.add_task(send_email_async, "Your Password Reset Code", request.email, email_body)

    return {"message": "OTP sent to email."}


# --- OPTION 2 STEP B: VERIFY OTP & RESET ---
@app.post("/reset-password/verify")
def verify_reset_otp(data: schemas.VerifyResetOTP, db: Session = Depends(get_db)):
    # 1. Find User
    user = db.query(models.UserLogin).filter(models.UserLogin.ULN_Email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # 2. Check if OTP matches
    if user.ULN_ResetOTP != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # 3. Check if OTP is expired
    if user.ULN_OTPExpiry and datetime.utcnow() > user.ULN_OTPExpiry:
        raise HTTPException(status_code=400, detail="OTP has expired")

    # 4. SUCCESS: Update Password & Clear OTP
    user.ULN_Password = data.new_password
    user.ULN_ResetOTP = None
    user.ULN_OTPExpiry = None
    db.commit()

    return {"message": "Password reset successful. You can now login."}


# ==========================================
# 4. SCHOOL ENDPOINTS (Requests)
# ==========================================

@app.post("/requests/create", response_model=schemas.RequestResponse)
def create_request(request: schemas.RequestCreate, db: Session = Depends(get_db)):
    return crud.create_request(db=db, request=request)

@app.get("/requests/{party_id}", response_model=List[schemas.RequestResponse])
def read_requests(party_id: int, db: Session = Depends(get_db)):
    return crud.get_party_requests(db, party_id=party_id)


# ==========================================
# 5. COMPANY ENDPOINTS (Donations)
# ==========================================

@app.post("/donations/create", response_model=schemas.DonationResponse)
def create_donation(donation: schemas.DonationCreate, db: Session = Depends(get_db)):
    return crud.create_donation(db=db, donation=donation)

@app.get("/donations/{party_id}", response_model=List[schemas.DonationResponse])
def read_donations(party_id: int, db: Session = Depends(get_db)):
    return crud.get_party_donations(db, party_id=party_id)


# ==========================================
# 6. MATCHING & TRANSACTIONS
# ==========================================

@app.get("/donations/available", response_model=List[schemas.DonationResponse])
def get_all_available_donations(db: Session = Depends(get_db)):
    return db.query(models.ItemDonations).filter(models.ItemDonations.ITD_PendingQuantity > 0).all()

@app.get("/matches/donations/{item_type}")
def find_matching_donations(item_type: str, db: Session = Depends(get_db)):
    return crud.find_matches_for_request(db, item_type)

@app.get("/matches/requests/{item_type}")
def find_matching_requests(item_type: str, db: Session = Depends(get_db)):
    return crud.find_matches_for_donation(db, item_type)

@app.post("/transact/match")
def execute_match(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):
    return crud.process_transaction(db, transaction)