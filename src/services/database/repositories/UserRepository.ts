// user repo code here 

import { databaseService } from "../database.service";
import { User , CreateUserDTO } from "@/src/types";


export class UserRepository {


      // creating user 

      static async create(userData : CreateUserDTO) : Promise<User> {

          const now  = Date.now();

          const user : User = {
             ...userData,
             created_at : now,
             updated_at : now,
          };


          await databaseService.runAsync(
             `INSERT INTO users (id , email , name , phone , role , avatar_url , created_at , updated_at) VALUES (? , ? , ? , ? , ? , ? , ? , ?)`,

             [
               user.id,
               user.email,
               user.name,
               user.phone || null,
               user.role,
               user.avatar_url || null,
               user.created_at,
               user.updated_at,
             ]
          );

          return user;
      }



      //getting user by their id  

      static async getById(id : string) : Promise<User | null> {
          return await databaseService.getFirstAsync<User>(
             'SELECT * FROM users WHERE id = ?',
             [id]
          );
      }

      //getting user by email id  

      static async getByEmail(email : string) : Promise<User | null> {
          return await databaseService.getFirstAsync<User>(
            'SELECT * FROM users WHERE email = ?',
            [email]
          );
      }


      //updating user 

      static async update(id : string , updates : Partial<Omit<User , 'id' | 'email' | 'created_at'>>) : Promise<User | null> {
          
         const allowedFields = ['name' , 'phone' , 'avatar_url' , 'role'];

         const fields = Object.keys(updates).filter(key => allowedFields.includes(key));

         if(fields.length === 0)  return this.getById(id);


         const setClause = fields.map(field => `${field} = ?`).join(', ');

         const values = fields.map(field => updates[field as keyof typeof updates]);


         await databaseService.runAsync(
            `UPDATE users SET ${setClause} , updated_at = ? WHERE id = ?`,
            [...values , Date.now() , id]
         );


         return this.getById(id);
      }


      //delete user 

      static async delete(id : string) : Promise<boolean> {
          const result = await databaseService.runAsync(
             'DELETE FROM users WHERE id = ?',
             [id]
          );

          return result.changes > 0;
      }


      //getting all user by their roles 

      static async getByRole(role : string) : Promise<User[]> {
          return await databaseService.getAllAsync<User>(
            'SELECT * FROM users WHERE role = ? ORDER BY name',
            [role]
          );
      }


      //searching users 

      static async search(query : string) : Promise<User[]> {

          const searchPattern = `%${query}%`;

          return await databaseService.getAllAsync<User>(
             'SELECT * FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY name LIMIT 50',
             [searchPattern , searchPattern]
          );
      }


      //checking for email exists or not  

      static async emailExists(email : string) : Promise<boolean> {
          const result = await databaseService.getFirstAsync<{count : number}>(
            'SELECT COUNT(*) as count FROM users WHERE email = ?',
            [email]
          );

          return (result?.count || 0) > 0;
      }

      //  get all users (admin)

      static async getAll(limit : number = 100) : Promise<User[]>{

         return await databaseService.getAllAsync<User>(
            'SELECT * FROM users ORDER BY created_at DESC LIMIT ?',
            [limit]
         );
      }

      //counting users by role  

      static async countByRole(role : string) : Promise<number> {
          const result = await databaseService.getFirstAsync<{count : number}>(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            [role]
          );
          return result?.count || 0;
      }


      //getting user statistics 

      static async getUserStats(userId : string) {
          
          // total queue joined 

          const totalQueues = await databaseService.getFirstAsync<{count : number}>(
            'SELECT COUNT(DISTINCT queue_id) as count FROM queue_history WHERE user_id = ?',
            [userId]
          );

          // getting avg wait time 

          const avgWaitTime = await databaseService.getFirstAsync<{avg : number | null}>(

            'SELECT AVG(wait_time) as avg FROM queue_history WHERE user_id = ?',
            [userId]
          );


          //getting active queue count 

          const activeQueues = await databaseService.getFirstAsync<{count : number}>(

            `SELECT COUNT(*) as COUNT FROM queue_entries
             WHERE user_id = ? AND status IN('waiting' , 'called')`,

             [userId]
          );


          return {
            total_queue_joined : totalQueues?.count || 0,
            avg_wait_time : Math.round(avgWaitTime?.avg || 0),
            active_queues : activeQueues?.count || 0,
          };
      }


      //creating users in bulk 

      static async bulkCreate(users : CreateUserDTO[]) : Promise<User[]> {
          const createdUsers : User[] = [];


          for(const userData of users) {
             const user = await this.create(userData);
             createdUsers.push(user);
          }
          return createdUsers;
      }

      //updating user last active timestamp
      
      static async updateLastActive(id : string) : Promise<void> {
          await databaseService.runAsync(
            'UPDATE users SET updated_at = ? WHERE id = ?',
            [Date.now() , id]
          );
      }


    /// todo - deactivating the user id 


      //check if phone exists 

      static async phoneExists(phone : string) : Promise<boolean> {
          const result = await databaseService.getFirstAsync<{count : number}>(

            'SELECT COUNT(*) as count FROM users WHERE phone = ? AND phone IS NOT NULL',
            [phone]
          );
          return (result?.count || 0) > 0;
      }


      //finding user by partial name match  

      static async findByName(name : string) : Promise<User[]> {
         const searchPattern = `%${name}%`;
         return await databaseService.getAllAsync<User>(
             'SELECT * FROM users WHERE name LIKE ? ORDER BY name LIMIT 20',
             [searchPattern]
         );
      }


      //getting business users with their queue count 

      static async getBusinessWithQueueCount() : Promise<Array<User & {queue_count : number}>> {
          return await databaseService.getAllAsync<User & {queue_count : number}>(
            `SELECT u.*, COUNT(q.id) as queue_count
             FROM users u
             LEFT JOIN queues q ON u.id = q.business_id
             WHERE u.role = 'business'
             GROUP BY u.id
             ORDER BY queue_count DESC, u.name`,

             []
          );
      }


      //validating user credentials , just for try 

      // todo - do proper password hashing fot authentication

      static async validateCredentials(email : string , password : string) : Promise<User | null>{

     //for testing  

     const user = await this.getByEmail(email);


     if(user) {
       return user;
     }

     return null;

      }
};


export default UserRepository;


