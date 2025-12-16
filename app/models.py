from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# 1. LOGIN TABLE (Email & Password)

class UserLogin(Base):
    __tablename__ = "OPT_UserLogin"

    # Columns
    ULN_ID = Column(Integer, primary_key=True, index=True)
    ULN_Email = Column(String, unique=True, index=True)
    ULN_Password = Column(String)  
    ULN_CreateDate = Column(DateTime, default=datetime.utcnow)
    
    # NEW COLUMNS FOR PASSWORD RESET
    ULN_ResetOTP = Column(String, nullable=True)     # Stores the 8-digit code
    ULN_OTPExpiry = Column(DateTime, nullable=True)  # Stores when the code expires

    # Relationship: One Login links to One Party Profile
    party = relationship("Party", back_populates="login", uselist=False)



# 2. PARTY TABLE (User Profile Info)

class Party(Base):
    __tablename__ = "OPT_Party"

    # Columns
    PTY_ID = Column(Integer, primary_key=True, index=True)
    ULN_ID = Column(Integer, ForeignKey("OPT_UserLogin.ULN_ID")) 
    
    PTY_Name = Column(String)      
    PTY_Type = Column(String)      
    PTY_Phone = Column(String)
    
    # Address Details
    PTY_AddressLine1 = Column(String, nullable=True)
    PTY_AddressLine2 = Column(String, nullable=True)
    PTY_City = Column(String, nullable=True)
    PTY_State = Column(String, nullable=True)
    PTY_Zip = Column(String, nullable=True)

    # Relationships
    login = relationship("UserLogin", back_populates="party")
    donations = relationship("ItemDonations", back_populates="donor")
    requests = relationship("ItemsRequest", back_populates="requester")



# 3. DONATIONS TABLE (What Companies Have)
class ItemDonations(Base):
    __tablename__ = "OPT_ItemDonations"

    # Columns
    ITD_ID = Column(Integer, primary_key=True, index=True)
    PTY_ID = Column(Integer, ForeignKey("OPT_Party.PTY_ID")) 
    
    ITD_ItemName = Column(String)    
    ITD_Quantity = Column(Integer)   
    ITD_PendingQuantity = Column(Integer) 
    ITD_CreateDate = Column(DateTime, default=datetime.utcnow)

    # Relationship
    donor = relationship("Party", back_populates="donations")



# 4. REQUESTS TABLE (What Schools Need)

class ItemsRequest(Base):
    __tablename__ = "OPT_ItemsRequest"

    # Columns
    ITR_ID = Column(Integer, primary_key=True, index=True)
    PTY_ID = Column(Integer, ForeignKey("OPT_Party.PTY_ID")) 
    
    ITR_ItemName = Column(String)    
    ITR_Quantity = Column(Integer)   
    ITR_PendingQuantity = Column(Integer) 
    ITR_CreateDate = Column(DateTime, default=datetime.utcnow)

    # Relationship
    requester = relationship("Party", back_populates="requests")



# 5. TRANSACTIONS TABLE (History)

class FilledDonations(Base):
    __tablename__ = "OPT_FilledDonations"

    FID_ID = Column(Integer, primary_key=True, index=True)
    
    ITR_ID = Column(Integer, ForeignKey("OPT_ItemsRequest.ITR_ID")) 
    ITD_ID = Column(Integer, ForeignKey("OPT_ItemDonations.ITD_ID")) 
    
    FID_Quantity = Column(Integer) 
    FID_Date = Column(DateTime, default=datetime.utcnow)