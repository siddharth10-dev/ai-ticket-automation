from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    mobile_number: str
    email: str
    password: str
