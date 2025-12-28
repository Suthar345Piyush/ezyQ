// queue entry repo code here 


import { databaseService } from "../database.service";
import { QueueEntry , CreateQueueEntryDTO , QueueEntryWithDetails, Queue} from "@/src/types";


export class QueueEntryRepository {
      
       // creating queue entry 

       static async create(entryData : CreateQueueEntryDTO) : Promise<QueueEntry> {
          const now  = Date.now();


          //getting next ticket number 

          const lastTicket = await databaseService.getFirstAsync<{max_ticket : number | null}>(
             
            `SELECT MAX(ticket_number) as max_ticket
             FROM queue_entries
             WHERE queue_id ?`,

             [entryData.queue_id]
          );


          const ticketNumber = (lastTicket?.max_ticket || 0) + 1;

          const entry : QueueEntry =  {
             ...entryData,
             ticket_number : ticketNumber,
             priority : entryData.priority || 0,
             joined_at : now, 
          };


          await databaseService.runAsync(

            `INSERT INTO queue_entries(
               id , queue_id , user_id , ticket_number , status , priority , joined_at , served_at , estimated_wait_time , notes , called_at , cancelled_at,
            ) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)`,

            [
               entry.id,
               entry.user_id,
               entry.queue_id,
               entry.ticket_number,
               entry.status,
               entry.priority,
               entry.joined_at,
               entry.called_at || null,
               entry.served_at || null,
               entry.cancelled_at || null,
               entry.estimated_wait_time || null,
               entry.notes || null,
            ]
          );

          return entry;
       }


       //getting entry by id  

       static async getById(id : string) : Promise<QueueEntry | null>{

          return await databaseService.getFirstAsync<QueueEntry>(

            `SELECT * FROM queue_entries WHERE id = ?`,

            [id]
          );
       }


       //getting entry with details 

       static async getByIdWithDetails(id : string) : Promise<QueueEntryWithDetails | null> {
          return await databaseService.getFirstAsync<QueueEntryWithDetails>(

            `SELECT qe.*, q.name as queue_name , q.status as queue_status,
             u.name as user_name , u.email as user_email
              FROM queue_entries qe
              JOIN queues q ON qe.queue_id = q.id
              JOIN users u ON qe.user_id = u.id
              WHERE qe.id = ?`,

              [id]
          );
       }

       //getting all entries for a queue  

       static async getByQueueId(
          queueId : string,
          status? : QueueEntry['status']
       ) : Promise<QueueEntryWithDetails[]> {
           
             let sql = `SELECT qe.*, u.name as user_name , u.email as user_email,
               q.name as queue_name , q.status as queue_status
                FROM queue_entries qe
                 JOIN users u ON qe.user_id = u.id
                 JOIN queues q ON qe.queue_id = q.id
                  WHERE qe.queue_id = ?`;

                  const params : any[] = [queueId];


                  if(status) {
                      sql += ` AND qe.status = ?`;
                      params.push(status);
                  }


                  sql += `ORDER BY qe.priority  DESC , qe.joined_at ASC`;


                  return await databaseService.getAllAsync<QueueEntryWithDetails>(sql , params);
       }


       //get user's active entries 

       static async getUserActiveEntries(userId : string) : Promise<QueueEntryWithDetails[]>{
          return await databaseService.getAllAsync<QueueEntryWithDetails>(

            `SELECT qe.*, q.name as queue_name , q.status as queue_status,
               u.name as user_name , u.email as user_email
                FROM queue_entries qe
                 JOIN queues q ON qe.queue_id = q.id
                  JOIN users u ON qe.user_id = u.id
                 WHERE qe.user_id = ? AND qe.status IN('waiting' , 'called')
                  ORDER BY qe.joined_at DESC`,

                  [userId]
          );
       }


       //get user's position in queue  

       static async getUserPosition(queueId : string , userId : string) : Promise<number> {

          const userEntry = await databaseService.getFirstAsync<QueueEntry>(

             `SELECT * FROM queue_entries WHERE queue_id = ? AND user_id = ? AND STATUS = "watiting"`,

             [queueId , userId]
          );

          if(!userEntry) return 0;

          const result = await databaseService.getFirstAsync<{position : number}>(

            `SELECT COUNT(*) + 1 as position
              FROM queue_entries
              WHERE queue_id = ?
              AND status = 'waiting'
              AND (
                priority > ? OR (priority = ? AND joined_at < ?)
              )`,

              [queueId , userEntry.priority , userEntry.priority , userEntry.joined_at]
          );


          return result?.position || 0;
       }


       //getting next person in queue
       
       static async getNextInQueue(queueId : string) : Promise<QueueEntryWithDetails | null> {
         return await databaseService.getFirstAsync<QueueEntryWithDetails>(

              `SELECT qe.*, u.name as user_name , u.email as user_email,
                 q.name as queue_name , q.status as queue_status
                 FROM queue_entries qe
                 JOIN users u ON qe.user_id = u.id,
                 JOIN queues q ON qe.queue_id = q.id,
                 WHERE qe.queue_id = ? AND qe.status = 'waiting'
                 ORDER BY qe.priority DESC ,  qe.joined_at ASC
                 LIMIT 1
              `,

              [queueId]
         );
       }




       //updating entry status  

       static async updateStatus( id : string, status : QueueEntry['status']) : Promise<QueueEntry | null> {

         const now  = Date.now();

         const statusField = status === 'called' ? 'called_at'
          : status === 'served' ? 'served_at'
          : status === 'cancelled' ? 'cancelled_at'
          : null;


          if(statusField) {
             await databaseService.runAsync(

               `UPDATE queue_entries SET status = ? , ${statusField} = ? WHERE id = ?`,

               [status , id , now]
             );
          }

          else {
             await databaseService.runAsync(

               `UPDATE queue_entries SET status = ? WHERE id = ?`,

               [status , id]
             );
          }

          return this.getById(id);
       }


       //calling next person 

       static async callNext(queueId : string) : Promise<QueueEntry | null> {

         const next = await this.getNextInQueue(queueId);

         if(!next) return null;

          // updating the status , to called the next person in queue  

         return this.updateStatus(next.id , 'called');

       }

       //updating entry

      static async update(id : string , updates : Partial<QueueEntry>) : Promise<QueueEntry | null> {

            const allowedFields = ['status' , 'priority' , 'estimated_wait_time' , 'notes'];

            const fields = Object.keys(updates).filter(key => allowedFields.includes(key));


            if(fields.length === 0) return this.getById(id);

            const setClause = fields.map(field => `${field} = ?`).join(', ');

            const values = fields.map(val => updates[val as keyof QueueEntry]);

            await databaseService.runAsync(
               `UPDATE queue_entries SET ${setClause} WHERE id = ?`,
               [...values , id]
            );

            return this.getById(id);
      };


      //cancelling the entry  

      static async cancel(id : string) : Promise<QueueEntry | null> {

           return this.updateStatus(id , 'cancelled');

      }


      // marking as served and moving to history  

      static async markAsServed(id : string) : Promise<boolean> {

          const entry = await this.getById(id);

          if(!entry) return false;

          await this.updateStatus(id , 'served');


          //calculating the wait time and service time  

          const waitTime = entry.called_at ? 
              entry.called_at - entry.joined_at : 
              Date.now() - entry.joined_at;


          const serviceTime = entry.called_at ?
              Date.now() - entry.called_at
              : 0;
              
              
              //adding it to the history 

              await databaseService.runAsync(

                `INSERT INTO queue_history (
                  queue_id , user_id , ticket_number , wait_time , service_time , status , joined_at , completed_at
                ) VALUES (? , ? , ? , ? , ? , ? , ? , ?)`,

                [

                  entry.user_id,
                  entry.queue_id,
                  entry.ticket_number,
                  Math.floor(waitTime / 1000 / 60),    // in minutes 
                  Math.floor(serviceTime / 1000 / 60),
                  'served',
                  entry.joined_at,
                  Date.now(),
                ]
              );

              return true;

      }


      //deleting the entry 

      static async delete(id : string) : Promise<boolean> {

         const result = await databaseService.runAsync(

            `DELETE FROM queue_entries WHERE id = ?`,

            [id]
         );

         return result.changes > 0;
      }


      //get waiting count 

      static async getWaitingCount(queueId : string) : Promise<number> {

         const result = await databaseService.getFirstAsync<{count : number}>(
             
             `SELECT COUNT(*) as count FROM queue_entries WHERE queue_id = ? AND status = "waiting"`,

             [queueId]
         )

         return result?.count || 0;

      }


      //cheking if user is in queue  

      static async isUserInQueue(queueId : string , userId : string) : Promise<boolean> {

         const result = await databaseService.getFirstAsync<{count : number}>(

            `SELECT COUNT(*) as count FROM queue_entries WHERE queue_id = ? AND user_id = ? AND status IN('waiting' , 'called')`,

            [queueId , userId]

         )

         return (result?.count || 0) > 0;

      }

      // get user entry in queue , those are in still waiting or being called

      static async getUserEntry(userId : string , queueId : string) : Promise<QueueEntry | null> {

          return  await databaseService.getFirstAsync<QueueEntry>(

            `SELECT * FROM queue_entries WHERE queue_id = ? AND user_id = ? AND status IN('waiting' , 'called')`,

            [queueId , userId]

         );
      };
   }



 export default QueueEntryRepository;


