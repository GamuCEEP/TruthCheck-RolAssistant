import {mongo} from 'root/deps.ts';

interface User{
  _id: mongo.ObjectId;
  name: string;
  
}