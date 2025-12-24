// user repo code 


import { db } from "../database.service";

export interface User {
   id : string;
   name : string;
   email : string;
   phone? : string;
   role : 'user' | 'business' | 'admin';
   avatar_url? : string;
   created_at : number;
   updated_at : number;
}

export class UserRepository {
   
}