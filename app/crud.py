from sqlalchemy.orm import Session, joinedload
from . import models, schemas


# 1. USER SIGNUP & LOGIN

def create_party(db: Session, user: schemas.UserCreate):
    # Step 1: Create Login
    db_login = models.UserLogin(
        ULN_Email=user.email,
        ULN_Password=user.password, 
    )
    db.add(db_login)
    db.commit()
    db.refresh(db_login)

    # Step 2: Create Party Profile
    db_party = models.Party(
        PTY_Name=user.name,
        PTY_Type=user.user_type,
        PTY_Phone=user.phone,
        PTY_AddressLine1=user.address1,
        PTY_AddressLine2=user.address2,
        PTY_City=user.city,
        PTY_State=user.state,
        PTY_Zip=user.zip,
        ULN_ID=db_login.ULN_ID
    )
    db.add(db_party)
    db.commit()
    db.refresh(db_party)
    return db_party



# 2. SCHOOL FEATURES (REQUESTS)


def create_request(db: Session, request: schemas.RequestCreate):
    db_request = models.ItemsRequest(
        PTY_ID=request.user_id,
        ITR_ItemName=request.item_name,
        ITR_Quantity=request.quantity,
        ITR_PendingQuantity=request.quantity 
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

# --- UPDATED FUNCTION ---
def get_party_requests(db: Session, party_id: int):
    """
    Fetch all requests for a School AND find out which Company fulfilled them.
    """
    requests = db.query(models.ItemsRequest).filter(models.ItemsRequest.PTY_ID == party_id).all()
    
    results = []
    for req in requests:
        # Convert DB object to Schema object so we can add the name
        data = schemas.RequestResponse.model_validate(req)
        
        # Check transaction table to see if this request was filled
        filled = db.query(models.FilledDonations).filter(models.FilledDonations.ITR_ID == req.ITR_ID).first()
        
        # If yes, find the Company Name
        if filled:
            don = db.query(models.ItemDonations).filter(models.ItemDonations.ITD_ID == filled.ITD_ID).first()
            if don and don.donor:
                data.match_name = don.donor.PTY_Name
        
        results.append(data)
    return results



# 3. COMPANY FEATURES (DONATIONS)


def create_donation(db: Session, donation: schemas.DonationCreate):
    db_donation = models.ItemDonations(
        PTY_ID=donation.user_id,
        ITD_ItemName=donation.item_name,
        ITD_Quantity=donation.quantity,
        ITD_PendingQuantity=donation.quantity 
    )
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)
    return db_donation

# --- UPDATED FUNCTION ---
def get_party_donations(db: Session, party_id: int):
    """
    Fetch all donations for a Company AND find out which School accepted them.
    """
    donations = db.query(models.ItemDonations).filter(models.ItemDonations.PTY_ID == party_id).all()
    
    results = []
    for don in donations:
        # Convert DB object to Schema object so we can add the name
        data = schemas.DonationResponse.model_validate(don)
        
        # Check transaction table to see if this donation was used
        filled = db.query(models.FilledDonations).filter(models.FilledDonations.ITD_ID == don.ITD_ID).first()
        
        # If yes, find the School Name
        if filled:
            req = db.query(models.ItemsRequest).filter(models.ItemsRequest.ITR_ID == filled.ITR_ID).first()
            if req and req.requester:
                data.match_name = req.requester.PTY_Name
        
        results.append(data)
    return results



# 4. SMART MATCHING LOGIC


def find_matches_for_request(db: Session, item_type: str):
    return db.query(models.ItemDonations).options(joinedload(models.ItemDonations.donor)).filter(
        models.ItemDonations.ITD_ItemName == item_type,
        models.ItemDonations.ITD_PendingQuantity > 0
    ).all()

def find_matches_for_donation(db: Session, item_type: str):
    return db.query(models.ItemsRequest).options(joinedload(models.ItemsRequest.requester)).filter(
        models.ItemsRequest.ITR_ItemName == item_type,
        models.ItemsRequest.ITR_PendingQuantity > 0
    ).all()



# 5. PROCESS TRANSACTION (The 'Match')


def process_transaction(db: Session, transaction: schemas.TransactionCreate):
    # 1. Get Request and Donation
    req = db.query(models.ItemsRequest).filter(models.ItemsRequest.ITR_ID == transaction.request_id).first()
    don = db.query(models.ItemDonations).filter(models.ItemDonations.ITD_ID == transaction.donation_id).first()
    
    # 2. Update Quantities
    req.ITR_PendingQuantity -= transaction.quantity
    don.ITD_PendingQuantity -= transaction.quantity
    
    # 3. Record Transaction
    filled = models.FilledDonations(
        ITR_ID=req.ITR_ID,
        ITD_ID=don.ITD_ID,
        FID_Quantity=transaction.quantity
    )
    db.add(filled)
    db.commit()
    
    return {"message": "Transaction Successful"}