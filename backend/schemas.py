from pydantic import BaseModel
import datetime as dt

class CreateUser(BaseModel):
  full_name:str
  username: str
  password: str
  user_image: str
  
class UserTransaction(CreateUser):
  id:int

class CreateUsers(BaseModel):
  full_name:str
  
class UserTransactions(CreateUsers):
  id:int

class DateModel(BaseModel):
  date_created: dt.datetime

  class Config:
    from_attributes= True 

class ImageBase(BaseModel):
  id: int
  image_url : str
  image_name: str

class ContactsBase(BaseModel):
  first_name: str
  last_name: str
  email: str
  mobile_no: str
  state_name: str
  country_name: str
  photo_name: str
  username: str
  
class TransactionModel(ContactsBase):
  id: int

class ContactBase(BaseModel):
  first_name: str
  last_name: str
  email: str
  mobile_no: str
  state_name: str
  country_name: str
  photo_name: str
  
class TransactionsModel(ContactBase):
  id: int

  class Config:
    from_attributes= True 
       