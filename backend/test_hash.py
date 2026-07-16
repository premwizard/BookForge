from app.security.hashing import verify_password, get_password_hash
from app.database.session import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == 'admin@bookforge.com').first()

if user:
    print(f"User hash: {user.hashed_password}")
    try:
        res = verify_password('admin123', user.hashed_password)
        print(f"Verify result: {res}")
    except Exception as e:
        print(f"Exception: {e}")
else:
    print("User not found!")
