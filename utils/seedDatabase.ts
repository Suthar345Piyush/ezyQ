// making dummy data , to test the db and seeding it dummy data , for dev purpose only  

import {UserRepository} from '.././src/services/database/repositories/UserRepository';
import {QueueRepository} from '.././src/services/database/repositories/QueueRepository';
import { QueueEntryRepository } from '.././src/services/database/repositories/QueueEntryRepository';
import { generateId } from '../utils/index';


//creating demo data to test the db working  

export async function seedDatabase() {
     try{
        console.log('Starting database seeding....');


          // creating demo users 

          const demoUser = await UserRepository.create({
              id : generateId(),
              email : 'jhon@example.com',
              name : 'John John',
              phone : '+1234567890',
              role : 'user',
          });

          const demoBusiness1 = await UserRepository.create({
             id : generateId(),
             email : 'starbucks@example.com',
             name : 'Starbucks Coffee',
             phone : '+1234567891',
             role : 'business',
          });


          const demoBusiness2 = await UserRepository.create({
            id : generateId(),
            email : 'startruck@example.com',
            name : 'Startruck Coffee',
            phone : '+1234567892',
            role : 'business',
         });

         const demoBusiness3 = await UserRepository.create({
          id : generateId(),
          email : 'starduck@example.com',
          name : 'Starduck Coffee',
          phone : '+1234567893',
          role : 'business',
       });

       console.log('Created demo users');


        // creating demo queues  

        const queue1 = await QueueRepository.create({
            id : generateId(),
            business_id : demoBusiness1.id,
            name : 'Morning Coffee counter 1',
            description : 'Quick service for your morning coffee 1',
            category : 'Restaurant1',
            location : '123 Main St, Manhatten',
            latitude : 40.7128,
            longitude : -74.0060,
            max_capacity : 20,
            avg_service_time : 3,
            status : 'active',
            current_capacity : 15,
        });


        const queue2 = await QueueRepository.create({
          id : generateId(),
          business_id : demoBusiness2.id,
          name : 'Morning Coffee counter 2',
          description : 'Quick service for your morning coffee 2',
          category : 'Restaurant2',
          location : '123 Main St, Heathrow',
          latitude : 40.7580,
          longitude : -74.9855,
          max_capacity : 15,
          avg_service_time : 15,
          status : 'active',
          current_capacity : 10,
      });


      const queue3 = await QueueRepository.create({
        id : generateId(),
        business_id : demoBusiness3.id,
        name : 'Morning Coffee counter 3',
        description : 'Quick service for your morning coffee',
        category : 'Restaurant3',
        location : '123 Main St, Delhi',
        latitude : 40.7489,
        longitude : -74.9680,
        max_capacity : 30,
        avg_service_time : 10,
        status : 'active',
        current_capacity : 25,
    });

    const queue4 = await QueueRepository.create({
      id : generateId(),
      business_id : demoBusiness1.id,
      name : 'Lunch Rush',
      description : 'Grab your lunch quickly',
      category : 'Restaurant',
      location : '123 Main St, Mumbai',
      latitude : 40.7128,
      longitude : -74.0060,
      max_capacity : 25,
      avg_service_time : 5,
      status : 'paused',
      current_capacity : 15,
  });


   // creating some queue entries 

   const entry1 = await QueueEntryRepository.create({
      id : generateId(),
      queue_id : queue1.id,
      user_id : demoUser.id,
      status : 'waiting',
      estimated_wait_time : 9,
   });


   //adding more dummy entries to queue1 

   for(let i=0; i<5; i++){
     const dummyUser = await UserRepository.create({
       id : generateId(),
       email : `user${i}@example.com`,
       name : `User ${i + 1}`,
       role : 'user',
     });


     await QueueEntryRepository.create({
       id : generateId(),
       queue_id : queue1.id,
       user_id : dummyUser.id,
       status : 'waiting',
       estimated_wait_time : (6 - i) * 3,
     });
   }

   //update queue capacity 

   await QueueRepository.updateCapacity(queue1.id , 6);

   // add entries to queue2 

   for(let i=0; i<3; i++){
     const dummyUser = await UserRepository.create({
        id : generateId(),
        email : `person${i}@example.com`,
        name :  `Person ${i+1}`,
        role : 'user',
     });


     await QueueEntryRepository.create({
        id : generateId(),
        queue_id : queue2.id,
        user_id : dummyUser.id,
        status : "waiting",
        estimated_wait_time : (3 - i) * 15,
     });
   }


    await QueueRepository.updateCapacity(queue2.id , 3);

    console.log('Created demo queue entries');

    //adding some history data 
    const historyUser = await UserRepository.create({
       id : generateId(),
       email : 'history@example.com',
       name : 'History user',
       role : 'user'
    });


     const completedEntry = await QueueEntryRepository.create({
       id : generateId(),
       queue_id : queue1.id,
       user_id : historyUser.id,
       status : 'served',
     });


     await QueueEntryRepository.markAsServed(completedEntry.id);


     console.log('Created demo history');

     console.log('Database seeding completed');


     return {
        success : true,
        data : {
           users : {
              demoUser,
              businesses : [demoBusiness1 , demoBusiness2 , demoBusiness3],
           },
           queues : [queue1 , queue2 , queue3 , queue4],
           entry : entry1,
        }
     }
    } catch(error) {
       console.error('DB seeding failed:', error);

       return {
         success : false,
         error : error instanceof Error ? error.message : 'Unknown error',
       };
    }
 }


 //clearing all demo data 

 export async function clearDemoData() {
   const {databaseService} = await import('.././src/services/database/database.service');
   await databaseService.clearAllData();
   console.log('All demo data cleared');
 }


 //get seed credentials for easy login 

 export function getSeedCredentials() {
    return {
       user : {
         email : 'john@example.com',
         password : 'demo123',
       },
       business : {
         email : 'starbucks@example.com',
         password : 'demo123',
       },
    };
 }

 




