import datetime as dt
from sqlalchemy import  ForeignKeyConstraint, String, Integer, Column, DateTime, ForeignKey 
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Image(Base):
  __tablename__ ='images'
  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  image_name = Column(String(150), primary_key=True, index=True, unique=True)
  image_url = Column(String(250), index=True, unique=True)

class User(Base):
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
  full_name = Column(String(100))
  username = Column(String(100), index=True, unique=True)
  password = Column(String(150), index=True,)
  date_created = Column(DateTime(100), default=dt.datetime.utcnow)
  user_image = Column(String(150), primary_key=True, index=True)
    
class Contact(Base):
  __tablename__ = 'contacts' 
  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  first_name = Column(String(100), index=True)
  last_name = Column(String(100), index=True)
  email = Column(String(100), index=True, unique=True)
  mobile_no = Column(String(100), index=True, unique=True)
  state_name = Column(String(100), nullable=False)
  country_name = Column(String(100), nullable=False)
  photo_name = Column(String(150),  index=True, unique=True)
  username = Column(String(100), nullable=False)
 

  

  
  