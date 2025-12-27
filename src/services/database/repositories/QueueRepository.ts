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
        sql += `AND q.category = ?`;
        params.push(category);
      }

      sql += `
        ORDER BY q.priority DESC , q.current_capacity ASC
        LIMIT 50
      `;

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

     const waitingCount = await databaseService.getFirstAsync<{count : number}> (

       'SELECT COUNT(*) as count FROM queue_entries WHERE queue_id = ? AND status = "waiting"',
       [id]
     );



     const avgWaitTime = await databaseService.getFirstAsync<{avg : number | null}>(

       `SELECT AVG(wait_time) as avg FROM queue_history
        WHERE queue_id = ? AND completed_at > ?`,

        [id , Date.now() - 7 * 24 * 60 * 60 * 1000]     // it is for last 7 days 
     );

     const totalServed = await  databaseService.getFirstAsync<{count : number}>(

          'SELECT COUNT(*) as count FROM queue_history WHERE queue_id = ?',

          [id]
     );



    return {
      queue,
      waiting_time : waitingCount?.count || 0,
      avg_wait_time : Math.round(avgWaitTime?.avg || queue.avg_service_time),
      total_served : totalServed?.count || 0,
    }
   };



  //  getting queue  categories 

  static async  getCategories() : Promise<string[]> {
     const results = await databaseService.getAllAsync<{category : string}>(

        'SELECT DISTINCT category FROM queues WHERE category IS NOT NULL ORDER BY category',

     );

     return results.map(r => r.category);

  }



  //getting all queues 

  static async getAll(limit : number = 100) : Promise<QueueWithBusiness[]>{
      return await databaseService.getAllAsync<QueueWithBusiness>(

         `SELECT q.*, u.name as business_name , u.email as business_email
          FROM queues q
           JOIN users u ON q.business_id = u.id
           ORDER BY q.created_at DESC
           LIMIT ?`,

           [limit]
      );
  }


  //get queues by status  

  static async getByStatus(status : Queue['status']) : Promise<QueueWithBusiness[]>{
    return await databaseService.getAllAsync<QueueWithBusiness>(
      
         `SELECT q.*, u.name as business_name , u.email as business_email
          FROM queues q
          JOIN users u ON q.business_id = u.id
          WHERE q.status = ?
          ORDER BY q.created_at DESC`,

          [status]
    );
  }


  //get queues by categories 

  static async getByCategory(category : string , limit : number = 50) : Promise<QueueWithBusiness[]>{
      
       return await databaseService.getAllAsync<QueueWithBusiness>(
           
           `SELECT q.* , u.name as business_name , u.email as business_email
            FROM queues q
            JOIN users u ON q.business_id = u.id
            WHERE q.category = ? AND q.status = 'active'
            ORDER BY q.current_capacity ASC
            LIMIT ?`,

            [category , limit]
       );
  }



     // getting nearby queues 

     static async getNearby(
      latitide : number,
      longitude : number,
      radiusKm : number = 5
     ) : Promise<Array<QueueWithBusiness & {distance : number}>>{
        
         // haversine formula sqlite 

         return await databaseService.getAllAsync<QueueWithBusiness & {distance : number}>(

           `SELECT q.*, u.name as business_name , u.email as business_email,
           (6371 * acos(
            cos(radians(?)) * cos(radians(q.latitude)) * 
            cos(radians(q.longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(q.latitude))
           )) AS distance 
           FROM queues q
           JOIN users u ON q.business_id = u.id
           WHERE q.latitude IS NOT NULL
             AND q.longitude IS NOT NULL
             AND q.status = 'active'
             HAVING distance < ?
             ORDER BY DISTANCE ASC
           `,

           [latitide , longitude , radiusKm , latitide]
         );
     }


     // getting popular queues (which have most entries in last 7 days)

     static async getPopular(limit : number = 10) : Promise<Array<QueueWithBusiness & {entry_count : number}>> {
         
       return await databaseService.getAllAsync<QueueWithBusiness & {entry_count : number}>(

           `SELECT q.*, u.name as business_name , u.email as business_email
            COUNT(qe.id) as entry_count
             FROM queues q
             JOIN users u ON q.business_id = u.id
             LEFT JOIN queue_entries qe ON q.id = qe.queue_id
               AND qe.joined_at > ?
                WHERE q.status = 'active'
                GROUP BY q.id
                ORDER BY entry_count DESC
                LIMIT ?`,

                [Date.now() - 7 * 24 * 60 * 60 * 1000 , limit]
            
       )
     }

    //checking if queue is full 

    static async isFull(id : string) : Promise<boolean> {

      const queue = await this.getById(id);

      if(!queue) return true;


       // if current capacity greater then max then it is true 

      return queue.current_capacity >= queue.max_capacity;
    }


    //getting queue utilization %age 

    static async getUtilization(id : string) : Promise<number> {

       const queue = await this.getById(id);

       if(!queue) return 0;

       return Math.round((queue.current_capacity / queue.max_capacity) * 100);

    }


    // get business queue stats 

    static async getBusinessStats(businessId : string) {
       const totalQueues = await databaseService.getFirstAsync<{count : number}>(

            'SELECT COUNT(*) as count FROM queues WHERE business_id = ?',

            [businessId]
       );


       // active queues  

       const activeQueues = await databaseService.getFirstAsync<{count : number}>(

           'SELECT COUNT(*) as count FROM queues WHERE business_id = ? AND status = "active"',

           [businessId]
       );

       //total customers(users)
     
       const totalCustomers = await databaseService.getFirstAsync<{count : number}>(

         `SELECT COUNT(DISTINCT qe.user_id) as count
          FROM queue_entries qe
          JOIN queues q ON qe.queue_id = q.id
           WHERE q.business_id = ?`,

           [businessId]
       );


       // total served people 

       const totalServed = await databaseService.getFirstAsync<{count : number}>(

        `SELECT COUNT(*) as count
         FROM queue_history qh
         JOIN queues q ON qh.queue_id = q.id
          WHERE q.business_id = ?`,

          [businessId]
       );


     
       return {
         total_queues : totalQueues?.count || 0,
         active_queues : activeQueues?.count || 0,
         total_customers : totalCustomers?.count || 0,
         total_served : totalServed?.count || 0,
       }
    };

  

    //updating queue status in bulk amount 

    static async bulkUpdateStatus(queueIds : string[] , status : Queue['status']) : Promise<number> {
      
         const placeholders = queueIds.map(() => '?').join(', ');

         const result = await databaseService.runAsync(

           `UPDATE queues SET status = ? , updated_at = ? WHERE id IN(${placeholders})`,

           [status , Date.now() , ...queueIds]
         );

         return result.changes;
    }


    //after work done reset all queues , clearing all entries 

    static async reset(id : string) : Promise<Queue | null> {
        await databaseService.runAsync(

          'UPDATE queues SET current_capacity = 0 , current_number = 0 , updated_at = ? WHERE id = ?',

          [Date.now() , id]
        );


        // deleting all active entries for this queue  

         await databaseService.runAsync(

          'DELETE FROM queue_entries WHERE queue_id = ? AND status IN("waiting" , "called")',

          [id]
         );
    
         return this.getById(id);
    };
};


export default QueueRepository;


