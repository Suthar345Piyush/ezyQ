// global types definations for whole app

export type UserRole = "user" | "business" | "admin";

export interface User  {
   id : string;
   email : string;
   name : string;
   phone? : number;
   role : UserRole;
   avatar_url? : string;
   created_at : number;
   updated_at : number;
}

export interface CreateUserDTO {
   id : string;
   name : string;
   email : string;
   phone? : number;
   role : UserRole;
   avatar_url? : string;
}

// queue  types  

export type QueueStatus = "active" | "paused" | "closed";

export interface Queue {
   id : string;
   business_id : string;
   name : string;
   description? : string;
   category? : string;
   location? : string;
   latitude? : number;
   longitude? : number;
   max_capacity : number;
   current_capacity : number;
   avg_service_time : number;    //minutes 
   status : QueueStatus;
   current_number : number;
   is_favorite : number;
   created_at : number;
   updated_at : number;
}

//business specific type  

export interface QueueWithBusiness extends Queue {
   business_name : string;
   business_email : string;
}

export interface CreateQueueDTO {
   id : string;
   business_id : string;
   name : string;
   description? : string;
   category? : string;
   location? : string;
   latitude? : number;
   longitude? : number;
   max_capacity : number;
   current_capacity : number;
   avg_service_time : number;    //minutes 
   status : QueueStatus;
}


// queue  entry types 

export type QueueEntryStatus = 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show';

export interface QueueEntry {
   id : string;
   queue_id : string;
   user_id : string;
   ticket_number : string;
   status : QueueEntryStatus;
   priority : number;
   joined_at : number;
   served_at?: number;
   called_at? : number;
   cancelled_at? : number;
   estimated_wait_time? : number;   // minutes 
   notes? : string;
}


export interface QueueEntryWithDetails extends QueueEntry {
   queue_name : string;
   queue_status : QueueStatus;
   user_name : string;
   user_email : string;
}


export interface CreateQueueEntryDTO {
   id : string;
   queue_id : string;
   user_id : string;
   status : QueueEntryStatus;
   priority? : number;
   estimated_wait_time? : number;
   notes? : string;
}



// queue history types  

export interface QueueHistory {
   id : number;
   queue_id : string;
   user_id : string;
   ticket_number : number;
   wait_time : number;
   service_time : number;
   status : string;
   joined_at : number;
   completed_at : number;
   rating? : number;
   feedback? : string;
}










