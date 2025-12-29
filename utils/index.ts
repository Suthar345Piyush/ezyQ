// utility functions code 

import {format , formatDistance , formatDistanceToNow} from 'date-fns';

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
























