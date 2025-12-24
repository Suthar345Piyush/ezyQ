// queue entry repo whole code 

import { db } from "../database.service";

export interface QueueEntry {
   id : string;
   queue_id : string;
   user_id : string;
   ticket_number : number;
   status : 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';
   priority : number;
   joined_at : number;
   called_at? : number;
   served_at? : number;
   cancelled_at? : number;
   estimated_wait_time? : number;
   notes? : string;
}


export interface QueueEntryWithDetails extends QueueEntry {
  queue_name : string;
  queue_status : string;
  user_name : string;
  user_email : string;
}

export class QueueEntryRepository {
   
   // creating queue entry 

   static create(entry : Omit<QueueEntry , 'joined_at' | 'ticket_number'>): QueueEntry {
        const now  = Date.now();

        //get next ticket number 

        const lastTicket = db.getOne<{max_ticket : number}>(
           'SELECT MAX(ticket_number) as max_ticket FROM queue_entries WHERE queue_id = ?',
           [entry.queue_id]
        );


        const ticketNumber = (lastTicket?.max_ticket || 0 ) + 1;

        const entryData : QueueEntry = {
          ...entry,
          ticket_number : ticketNumber,
          joined_at : now,
        };


        db.runQuery(
          `INSERT INTO queue_entries (
             id , queue_id , user_id , ticket_number , status , priority , joined_at , called_at , served_at , cancelled_at , estimated_wait_time , notes
          ) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)`,

          [
            entryData.id,
            entryData.queue_id,
            entryData.user_id,
            entryData.ticket_number,
            entryData.status,
            entryData.priority || 0,
            entryData.joined_at,
            entryData.called_at || null,
            entryData.served_at || null,
            entryData.cancelled_at || null,
            entryData.estimated_wait_time || null,
            entryData.notes || null,
          ]
        );
        return entryData;
   }


     //get entry using id  

     static getById(id : string) : QueueEntry | null {
       return db.getOne<QueueEntry>(
         'SELECT * FROM queue_entries WHERE id = ?',
        [id],
       );
     }


     // get entry with details  

     static getByIdWithDetails(id : string) : QueueEntryWithDetails | null {
        
        return db.getOne<QueueEntryWithDetails> (
           `SELECT qe.* , q.name as queue_name , q.status as queue_status, u.name as user_name , u.email as user_email 
           FROM queue_entries qe
           JOIN queues q ON qe.queue_id = q.id
           JOIN users q ON qe.user_id = u.id
           WHERE qe.id = ?
           `,
           
           [id]
        );
     }


     //get all entries for a queue  

     static getByQueueId(queueId : string , status? : QueueEntry['status']) : QueueEntryWithDetails[] {
        let sql = `
         SELECT qe.* , u.name as user_name , u.email as user.email,
         q.name as queue_name , q.status as queue_status,
         FROM queue_entries qe
         JOIN users u ON qe.user_id = u.id,
         JOIN queues q ON qe.queue_id = q.id,
         WHERE qe.qeueu_id = ?   
        `;

        const params : any[] = [queueId];

        if(status) {
          sql += ' AND qe.status = ?';
          params.push(status);
        }


        sql += 'ORDER BY qe.priority DESC , qe.joined_at ASC';


        return db.getAll<QueueEntryWithDetails>(sql,params);
     }


     //getting user's active entry 

     static getUserActiveEntries(userId : string) : QueueEntryWithDetails[] {
        
        return db.getAll<QueueEntryWithDetails>(
         `SELECT qe.* q.name as queue_name , q.status as queue_status
           u.name as user_name , u.email as user_email
           FROM queue_entries qe
           JOIN queues q ON qe.queue_id = q.id,
           JOIN users u ON qe.user_id = q.id,
           WHERE qe.user_id = ? AND qe.status IN('waiting' , 'called')
           ORDER BY qe.joined_at DESC`,

           [userId]
        );
     }


        // get users position in the queue  

        


}