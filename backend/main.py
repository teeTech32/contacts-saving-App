
from fastapi import FastAPI, HTTPException, Depends,UploadFile,File,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.schemas import ContactsBase,CreateUser,TransactionModel,UserTransaction,TransactionsModel,ContactBase,UserTransactions, CreateUsers
from typing import Annotated, List
from backend import models
from backend.database import engine, SessionLocal
from sqlalchemy.orm import Session
from datetime import timezone, datetime, timedelta
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
import boto3
import jwt
from backend import key_config as keys

app = FastAPI()
outh2_scheme = OAuth2PasswordBearer(tokenUrl="token")

s3 = boto3.client(
                service_name ='s3',
                region_name = 'us-east-1',
                aws_access_key_id = keys.ACCESS_KEY_ID,
                aws_secret_access_key = keys.ACCESS_SECRETE_KEY 
                )
S3_BUCKET_NAME = 'mybucketcontacts'
S3_BUCKET_NAME2 = 'mybucketuse'

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*'],
  expose_headers=["*"]
)

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
    
db_dependency = Annotated[Session, Depends(get_db)] 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto" )

models.Base.metadata.create_all(bind=engine)

# Sign_Up and Login Authentication
def get_user_by_emil(username: str, db:Session):
  return db.query(models.User).filter(models.User.username==username).first()

@app.post('/register/', response_model=UserTransaction)
async def create_user(user:CreateUser, db:db_dependency):
  db_user= get_user_by_emil(user.username, db)
  if db_user:
    raise HTTPException(status_code=400, detail="Email already in use")
  else:
    create_user = models.User(username=user.username, password=pwd_context.hash(user.password), full_name = user.full_name, user_image = user.user_image)
    db.add(create_user)
    db.commit()
    return create_user

@app.get('/user/{username}')
async def get_user(username:str, db:db_dependency):
  db_user = db.query(models.User).filter(models.User.username==username).one()
  return db_user

@app.get('/userContacts/{username}', response_model= List[TransactionModel])
def get_user_by_emil(username:str , db:db_dependency):
  lastestUser = db.query(models.Contact).filter(models.Contact.username==username).all()
  return lastestUser
  
def authenticate_user(username:str, password:str, db:Session):
  user = db.query(models.User).filter(models.User.username==username).first()
  if not user:
    return False
  if not pwd_context.verify(password, user.password):
    return False
  return user 

def create_token(data:dict, expires_delta:timedelta | None = None ):
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  to_encode.update({"exp":expire})
  encoded_jwt = jwt.encode(to_encode, keys.JWT_SECRETE, algorithm = keys.ALGORITHM)
  return encoded_jwt

@app.post('/token/')
async def generate_token(form_data:OAuth2PasswordRequestForm=Depends(), db:Session = Depends(get_db)):
  user = authenticate_user(form_data.username, form_data.password, db)
  if not user:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
          detail="Incorrect username or password!",
          headers={"WWW-Authenticate": "Bearer"}
          )
  token_expier = timedelta(minutes=keys.ACCESS_TOKEN_EXPIRE)
  access_token = create_token(data={"sub":user.username}, expires_delta=token_expier)
  return {"access_token":access_token, "token_type":"bearer"}
 
# The Main App Section

@app.patch('/UpdateUser/{username}')
async def updateUser_image(username: str, db:db_dependency, file:UploadFile = File(...)):
  s3.upload_fileobj(file.file, S3_BUCKET_NAME, file.filename) 
  response = db.query(models.User).filter(models.User.username==username).one()
  if response is not None:
    response.user_image = file.filename
    response.username = response.username
    response.full_name = response.full_name
    response.password = response.password
    db.commit()
  else:
    raise HTTPException(status_code=404, detail='No Image or Images avaliable yet!')
  return response

@app.patch('/UpdateUserName/{username}', response_model=UserTransactions)
async def edit_username(username:str, data:CreateUsers, db:db_dependency):
  result = db.query(models.User).filter(models.User.username==username).one()
  if result is not None:
    result.user_image = result.user_image
    result.username =  result.username
    result.full_name = data.full_name 
    result.password = result.password
    db.commit()
    return result
  raise HTTPException(status_code=404, detail= f"No contact with the following ID:{id} is available!")

@app.post('/UploadImages/')
async def upload_images(db:db_dependency, file:UploadFile = File(...)):
  if file:
    s3.upload_fileobj(file.file, S3_BUCKET_NAME, file.filename,) 
    photo_url = f'https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file.filename}'
    filename = file.filename
    db_image = models.Image(image_url=photo_url, image_name=filename )
    db.add(db_image)
    db.commit()
    return f'{file.filename} was Uploaded successfully'
  else:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Unsupported file!.')
 
@app.post("/contacts/", response_model=TransactionModel)
async def create_contact(contacts:ContactsBase,db:db_dependency,): 
  db_contact = models.Contact(first_name=contacts.first_name, last_name=contacts.last_name,email=contacts.email, mobile_no=contacts.mobile_no, state_name=contacts.state_name, country_name=contacts.country_name, photo_name=contacts.photo_name, username=contacts.username )
  db.add(db_contact)
  db.commit()
  return db_contact

@app.get('/contacts/', response_model= List[TransactionModel] )
async def contacts_read(db:db_dependency):
  result = db.query(models.Contact).order_by(models.Contact.id).all()
  if not result:
    raise HTTPException(status_code=404, detail= "No contact is available yet!")
  return result
                 
@app.get('/contact/{id}', response_model=TransactionModel)
async def contacts_read(id:int, db:db_dependency):
  result = db.query(models.Contact).filter(models.Contact.id==id).one()
  if result is None:
    raise HTTPException(status_code=404, detail= f"No contact with the following ID:{id} is available!")
  return result

@app.get('/Getimage/{id}')
async def get_images(id:int, db:db_dependency):
  response = db.query(models.Image).filter(models.Image.id==id).one()
  if not response:
    raise HTTPException(status_code=404, detail='No Image or Images avaliable yet!')
  return response

@app.patch('/contact/{id}', response_model=TransactionsModel)
async def edit_contact(id:int, data:ContactBase, db:db_dependency):
  result = db.query(models.Contact).filter(models.Contact.id==id).one()
  if result is not None:
    result.first_name = data.first_name
    result.last_name = data.last_name
    result.email = data.email
    result.mobile_no = data.mobile_no 
    result.state_name = data.state_name 
    result.country_name = data.country_name
    result.photo_name = data.photo_name
    result.username = result.username
    db.commit()
    return result
  raise HTTPException(status_code=404, detail= f"No contact with the following ID:{id} is available!")

@app.patch('/UploadImage/{id}')
async def upload_images(id:int, db:db_dependency, file:UploadFile = File(...)):
  s3.upload_fileobj(file.file, S3_BUCKET_NAME, file.filename,) 
  photo_url = f'https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file.filename}'
  filename = file.filename
  result = db.query(models.Image).filter(models.Image.id==id).one()
  if result is not  None:
    result.image_url= photo_url
    result.image_name=filename 
    db.commit()
    return result
  else:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Unsupported file!.')
 
@app.delete('/contact/{id}')
async def delete_contact(id:int, db:db_dependency):
    result=db.query(models.Contact).filter(models.Contact.id==id).one()
    if result:
      db.delete(result)
      db.commit()
      return result
    else:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact id doesn't exist!.")

@app.delete('/image/{id}')
async def delete_image(id:int, db:db_dependency):
  result=db.query(models.Image).filter(models.Image.id==id).one()
  if result:
    db.delete(result)
    db.commit()
    return result
  else:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image id doesn't exist!.")


