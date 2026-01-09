// global types definations for whole app

export type UserRole = "user" | "business" | "admin";

export interface User  {
   id : string;
   email : string;
   name : string;
   phone? : string;
   role : UserRole;
   avatar_url? : string;
   created_at : number;
   updated_at : number;
}

export interface CreateUserDTO {
   id : string;
   name : string;
   email : string;
   phone? : string;
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
   ticket_number : number;
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
// time in minutes 
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

// Notification types  

export interface Notification {
    id : string;
    user_id : string;
    title : string;
    message : string;
    type : 'queue_joined' | 'position_update' | 'called' | 'cancelled' | 'general';
    data?: string;
    is_read:number;     // sqlite boolean 
    created_at : number;
}


// business settings type  

export interface BusinessSettings {
     id : string;
     business_id : string;
     operating_hours? : string;
     notification_enabled : number;
     auto_call_next : number;
     max_queues : number;
     booking_advance_days : number;
     settings_json? : string;
}



// api response type 

export interface ApiResponse<T> { 
   success : boolean;
   data? : T;
   error? : string;
   message? : string;
}

//form types  

export interface LoginForm {
    email : string;
    password : string;
}

export interface RegisterForm {
    name : string;
    email : string;
    password : string;
    confirmPassword : string;
    phone? : string;
    role : UserRole;
}


export interface CreateQueueForm {
    name : string;
    description? : string;
    category? : string;
    location? : string;
    max_capacity : number;
    avg_service_time : number;
}

//stats types  

export interface QueueStats {
    queue : Queue;
    waiting_time : number;
    avg_wait_time : number;
    total_served : number;
}


export interface DashboardStats {
    total_queues : number;
    active_queues : number;
    total_customers_today : number;
    avg_wait_time_today : number;
    total_served_today : number;
}


//location types 

export interface Location {
    longitude : number;
    latitude : number;
}

export interface QueueWithDistance extends QueueWithBusiness {
    distance : number;
}

//pagination types 

export interface PaginationParams {
    page : number;
    limit : number;
}

export interface PaginatedResponse<T> {
    data : T[];
    total : number;
    page : number;
    limit : number;
    hasMore : boolean;
}








