import { databaseService } from "../database.service";
import { QueueEntry , QueueEntryWithDetails , CreateQueueEntryDTO } from "@/src/types";


export class QueryEntryRepository {
      
     //creating queue  entry  

     static async create(entryData : CreateQueueEntryDTO) : Promise<QueueEntry> {


         //getting the creation time
         const now = Date.now();
         
         

         // getting next ticket number 
         const lastTicket = await databaseService.getFirst
         
         
        
     }
 


}