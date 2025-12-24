// user repo code 


import { backupDatabaseAsync } from "expo-sqlite";
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

    // creating user 

    static create(user : Omit<User, 'created_at' | 'updated_at'>) : User {

       const now = Date.now();
       const userData = {
         ...user,
         created_at : now,
         updated_at : now,
       };

       db.runQuery(
         `INSERT INTO users(id , email , name , phone , role , avatar_url , created_at , updated_at)
          VALUES (? , ? , ? , ? , ? , ? , ? , ?)`,

          [
            userData.id,
            userData.name,
            userData.email,
            userData.phone || null,
            userData.role,
            userData.avatar_url || null,
            userData.created_at,
            userData.updated_at,
          ]
       );

       return userData;
    }


    //getting user by id  

    static getById(id : string) : User | null {
       return db.getOne<User>('SELECT * FROM users WHERE id = ?', [id]);
    }

    // getting user by email 

    static getByEmail(email : string) : User | null {
       return db.getOne<User>('SELECT * FROM users WHERE email = ?' , [email]);
    }


   // updating the user

   static update(id : string , updates : Partial<User>) : User | null {

       const allowedFields = ['name' , 'phone' , 'avatar_url' , 'role'];

       const fields = Object.keys(updates).filter(key => allowedFields.includes(key));

       if(fields.length === 0) return this.getById(id);

       const setClause = fields.map(field => `${field} = ?`).join(', ');

       const values = fields.map(field => updates[field as keyof User]);

       db.runQuery(
         `UPDATE users SET ${setClause} , updated_at = ? WHERE id = ?`,
         [...values , Date.now() , id],
       );

       return this.getById(id);
   } 



   //deleting the  user 

   static delete(id : string) : boolean {
     const result = db.runQuery('DELETE FROM users WHERE id = ?' , [id]);
     return result.changes > 0;
   }


   //getting users on their role  

   static getByRole(role : string) : User[] {
     return db.getAll<User>('SELECT * FROM users WHERE role = ? ORDER BY name' , [role]);
   }

   // search users 

   static search(query : string) : User[] {

      const searchPattern = `%${query}%`;

      return db.getAll<User>(
         'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY name LIMIT 50',
         [searchPattern , searchPattern]
      );
   }


   //check if email exists already 

   static emailExists(email : string) : boolean {
      const result = db.getOne<{count : number}> (
        'SELECT COUNT(*) as count FROM users WHERE email = ?',
        [email]
      );

      return (result?.count || 0) > 0;
   }
}

export default UserRepository;

