// utility functions code 

import {format , formatDistance , formatDistanceToNow} from 'date-fns';
import {setTimeout} from 'timers';

// ====== generating id =======

export const generateId = () : string => {

    return `${Date.now()}_${Math.random().toString(36).substring(2 , 9)}`;

}


// ======= Date/time formating ========

export const formatTimestamp = (timestamp : number , formatStr : string = 'PPpp') : string => {

        return format(timestamp , formatStr);

}


export const formatRelativeTime = (timestamp : number) : string => {

    return formatDistanceToNow(timestamp , {addSuffix : true});

}

// wait time formating  

export const formatWaitTime  = (minutes : number ) : string => {

    if(minutes < 1) return 'Less than 1 min';
    if(minutes === 1) return '1 minute';
    if(minutes < 60) return `${minutes} minutes`;

    const hours = Math.floor(minutes / 60);

    const mins = minutes % 60;

    if(hours === 1 && mins === 0) return '1 hour';

    if(hours === 1) return `1 hour ${mins} min`;

    if(mins === 0) return `${hours} hours`;

    return `${hours} hours ${mins} min`;
};


// validation 

export const isValidEmail = (email : string) : boolean => {
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);

}


export const isValidPhone = (phone : string) : boolean => {
   
    const phoneRegex = /^\+?[\d\s-()]+$/;

    return phoneRegex.test(phone) && phone.replace(/\D/g , '').length >= 10;

};

// number formating  

export const formatNumber = (num : number) : string => {
   return num.toLocaleString();
}

export const formatPercentage = (value : number , total : number ) : string => {

   if(total === 0) return '0%';

   return `${Math.round((value / total) * 100)}%`;

}

 /// ============== Queue Calculation ================

 // wait time calculation 

 export const calculateEstimateWaitTime = ( position : number, avgServiceTime : number) : number => {
     return position * avgServiceTime;
 };


 // queue capacity calculation 

 export const calculateQueueCapacity = (current : number , max : number) : 'low' | 'mid' | 'high' => {
     
      const percentage = (current / max) * 100;

      if(percentage < 50)  return 'low';

      if(percentage < 80) return  'mid';

      return 'high';
 };

 // radians function 

 const toRad = (degrees : number) : number => {
   return degrees * (Math.PI / 180);
 }



 // distance calculation 

 export const calculateDistance = (lat1 : number , lon1 : number , lat2 : number , lon2 : number) : number => {

    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a) , Math.sqrt(1 - a));

    return R * c;

 };


 // fromating distance 

 export const formattDistance = (km : number) : string => {

     if(km < 1) return `${Math.round(km * 1000)}m`;

     return `${km.toFixed(1)}km`;
 } 


 // string helper functions  
  
 export const truncate = (str : string , maxLength : number) : string => {
      
      if(str.length <= maxLength) return str;

      return str.substring(0 , maxLength - 3) + '...';
 };


 //capitalize the returned string 

 export const capitalize = (str : string) : string => {

     return str.charAt(0).toUpperCase() + str.slice(1);

 }

 export const slugify = (str : string) : string => {

     return str.toLowerCase().trim().replace(/[^\w\s-]/g , '').replace(/[\s_-]+/g , '-').replace(/^-+|-+$/g , '');

 }

   

 // array helper function 

 export const groupBy = <T>(array : T[] , key : keyof T) : Record<string , T[]> => {
     
      return array.reduce((result , item) => {

          const group = String(item[key]);

          if(!result[group]) {
             result[group] = [];
          }

          result[group].push(item);
          
          return result;
      } , {} as Record<string , T[]>); 
 };


 //sorting according to values  

 export const sortBy = <T>(array : T[] , key : keyof T , order : 'asc' | 'desc' = 'asc') : T[] => {
      
      return [...array].sort((a , b) => {

          const aVal = a[key];
          const bVal = b[key];

          if(aVal < bVal)  return order === 'asc' ? -1 : 1;

          if(aVal > bVal)  return order === 'asc' ? 1 : -1;

          return 0;
      });
 };


 /// error handling  

 export const getErrorMessage = (error : unknown) : string => {

     if(error instanceof Error) return error.message;

     if(typeof error === 'string') return error;

     return 'An unexpected error occurred';
 };

 
 // debouncing  the function  

 export const debounce = <T extends (...args : any[]) => any> (
      func : T , wait : number
 ) : ((...args : Parameters<T>) => void) => {
     
       let timeout : ReturnType<typeof setTimeout>

      return (...args : Parameters<T>) => {

        // casting the variable to number  

         clearTimeout(timeout);

         timeout = setTimeout(() => func(...args) , wait);
      };
 };



 /// storage helper function 

 export const safeJsonParse = <T>(str : string | null , fallback : T) : T => {
      
       if(!str) return fallback;

       try {
         return JSON.parse(str) as T;
       } catch {
           return fallback;
       }
 };


 // status color  

 export const getStatusColor = (status : string) : string => {

     const colors : Record<string , string> = {

          active : '#10b981',
          paused: '#f59e0b',
          closed: '#ef4444',
          waiting: '#3b82f6',
          called: '#8b5cf6',
          served: '#10b981',
          cancelled: '#6b7280',
          no_show: '#ef4444',
     };

     return colors[status] || '#6b7280';
 };



 // constants 

 export const QUEUE_CATEGORIES = [
      'Restaurant',
      'Healthcare',
      'Retail',
       'Government',
       'Entertainment',
       'Service',
       'Transportation',
       'Education',
       'Other',
 ]  as const;

 export const TICKET_PREFIX = 'TKT';

 export const formatTicketNumber = (num : number , prefix : string = TICKET_PREFIX) : string => {
      return `${prefix}-${String(num).padStart(4 , '0')}`;
 };























