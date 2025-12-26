// queue entry repo code logic 

import { databaseService } from "../database.service";
import { Queue , QueueWithBusiness , CreateQueueDTO , QueueStats } from "@/src/types";



export class QueueRepository {

    // creating queue  

    static async create(queueData : CreateQueueDTO) : Promise<Queue> {

       const now = Date.now();

       const queue : Queue = {
         ...queueData,
         current_capacity : 0,
         current_number : 0,
         is_favorite : 0,
         created_at : now,
         updated_at : now,
       };


       await databaseService.runAsync(
        `INSERT INTO queues (
          id , business_id , name , description , category , location , longitude , latitide , max_capacity , current_capacity , avg_service_time , status , current_number , is_favorite , created_at , updated_at
        ) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)`,

        [
          queue.id,
          queue.name,
          queue.category,
          queue.business_id,
          queue.description || null,
          queue.category || null,
          queue.location || null,
          queue.latitude || null,
          queue.longitude || null,
          queue.max_capacity,
          queue.current_capacity,
          queue.avg_service_time,
          queue.status,
          queue.current_number,
          queue.is_favorite,
          queue.updated_at,
          queue.created_at,
        ]
       );

       return queue;
    }


    //getting queue by id  

    static async getById(id : string) : Promise<Queue | null> {
       return await databaseService.getFirstAsync<Queue>(
         'SELECT * FROM queues WHERE id = ?',
         [id]
       );
    }


    // getting queue by id with business info 

    static async getByIdWithBusiness(id : string) : Promise<QueueWithBusiness | null> {
       return await databaseService.getFirstAsync<QueueWithBusiness>(
        `SELECT q.*, u.name as business_name , u.email as business_email
         FROM queues q
         JOIN users u ON q.business_id = u.id
         WHERE q.id = ?`,
         [id]
       );
    }

    // getting all queues for a business 

    static async getByBusinessId(businessId : string) : Promise<Queue[]> {
       return await databaseService.getAllAsync<Queue>(
         'SELECT * FROM queues WHERE business_id = ? ORDER BY created_at DESC',
         [businessId]
       );
    }

    //getting active queues from business id

    static async getActiveQueues(limit : number = 50) : Promise<QueueWithBusiness[]> {

      return await databaseService.getAllAsync<QueueWithBusiness>(
        `SELECT q.*, u.name as business_name , u.email as business_email
         FROM queues q
         JOIN users u ON q.business_id = u.id
         WHERE q.status = 'active'
         ORDER BY q.current_capacity ASC , q.created_at DESC
         LIMIT ?`,
        
         [limit]
      );
    }


    //searching queues 

    static async search(query : string , category? : string) : Promise<QueueWithBusiness[]> {

      const searchPattern = `%${query}%`;

   // entire sql query for search 

      let sql = `
        SELECT q.*, u.name as business_name , u.email as business_email
        FROM queues q
        JOIN users u ON q.business_id = u.id
        WHERE (q.name LIKE ? OR q.description LIKE ? OR u.name LIKE ?)
      `;

      // some parameters , can be string as well 

      const params : any[] = [searchPattern , searchPattern , searchPattern];

      //checking if , category is mentioned then adding it's query to sql and pushing into parameters 

      if(category){
        sql += 'AND q.category = ?';
        params.push(category);
      }

      sql += ' ORDER BY q.status = "active" DESC , q.current_capacity ASC LIMIT 50',

      return await databaseService.getAllAsync<QueueWithBusiness>(sql , params);
    }


    //updating  the queue  

    static async update(id : string , updates : Partial<Queue>) : Promise<Queue | null> {
       const allowedFields = [
         'name' , 'description' , 'category' , 'location' , 'latitude' ,
         'max_capacity' , 'current_capacity' , 'avg_service_time' , 'status' , 'current_number'
       ];

       const fields = Object.keys(updates).filter(key => allowedFields.includes(key));


       if(fields.length === 0) return this.getById(id);


       const setClause = fields.map(field => `${field} = ?`).join(', ');

       const values = fields.map(val => updates[val as keyof Queue]);


       await  databaseService.runAsync(
         `UPDATE queues SET ${setClause}  , updated_at = ? WHERE id = ?`,
         [...values , Date.now() , id]
       );

       return this.getById(id);
    }


    // incrementing current number after updating the queue  

    static async incrementCurrNumber(id : string) : Promise<number> {

      await databaseService.runAsync(
         `UPDATE queues SET current_number = current_number + 1 , updated_at = ? WHERE id = ?`,
         
         [Date.now() , id]

      );

      const queue = await this.getById(id);

      return queue?.current_number || 0;
    }


    // updating capacity  

    static async updateCapacity(id : string , change : number) : Promise<Queue | null> {
        
       await databaseService.runAsync(
        'UPDATE queues SET current_capacity = current_capacity + ? , updated_at = ?  WHERE id = ?',

        [change , Date.now() , id]
       );

       return this.getById(id);
    }


    //updating the status  

   static async updateStatus(id : string , status : Queue['status']) : Promise<Queue | null> {

    await databaseService.runAsync(
       'UPDATE queues SET status = ? , updated_at = ?  WHERE id = ?',

       [status , Date.now() , id]
    );


    return this.getById(id);
   }


   //deleting the queue (boolean)
   
   static async delete(id : string) : Promise<boolean> {
    const  result = await databaseService.runAsync(
       'DELETE FROM queues WHERE id = ?',

       [id]
     );
     return result.changes > 0;
   }


   //get queue stats 

   static async getStats(id : string) : Promise<QueueStats | null> {

     const queue = await this.getById(id);

     if(!queue) return null;

     const waitingCount = 

     const avgWaitTime = 




   }









}
