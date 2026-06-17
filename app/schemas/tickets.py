from pydantic import BaseModel

class TicketCreate(BaseModel):
    user_id:int
    title:str
    description:str


