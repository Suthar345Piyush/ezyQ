// whole sqlite db logic here 

import * as SQLite from "expo-sqlite";


//db configuration 

const DB_NAME = 'ezyQ.db';
const DB_VERSION = 1;


 class DatabaseService {
    private static instance : DatabaseService;
    private db : SQLite.SQLiteDatabase;
    private isInitialized : boolean = false;



    //creating a constructor  

    private constructor() {
       this.db = SQLite.openDatabaseSync(DB_NAME);
    }


    //taking our created db instance 
    // if we don't have instance , then creating it and returning it  

    public static getInstance() : DatabaseService {
       if(!DatabaseService.instance) {
          DatabaseService.instance = new DatabaseService();
       }

       return DatabaseService.instance;
      
    }
    
    //seperate initialize function 

    public async intialize() : Promise<void> {

       if(this.isInitialized) return;

       try {
          this.createTables();
          this.isInitialized = true;
          console.log("DB initialized");
       } catch(error) {
          console.error("DB initialization failed:" , error);
          throw error;
       }
    }



    //initializing all tables,always wrapped them into try/finally statement
    
    private createTables() : void {
       

          // users table  

           this.db.runSync(`
             CREATE TABLE IF NOT EXISTS users (
               id TEXT PRIMARY KEY,
               email TEXT UNIQUE NOT NULL,
               name TEXT NOT NULL,
               phone TEXT,
               role TEXT CHECK(role IN('user' , 'business' , 'admin')) DEFAULT 'user',
               avatar_url TEXT,
               created_at INTEGER NOT NULL,
               updated_at INTEGER NOT NULL,
             );
          `);


          // queue table 

           this.db.runSync(`
             CREATE TABLE IF NOT EXISTS queues (
               id TEXT PRIMARY KEY,
               business_id TEXT NOT NULL,
               name TEXT NOT NULL,
               description TEXT,
               category TEXT,
               location TEXT,
               latitude REAL,
               longitude REAL,
               max_capacity INTEGER  DEFAULT 50,
               current_capacity INTEGER DEFAULT 0,
               avg_service_time INTEGER DEFAULT 10,
               status TEXT CHECK(status IN('active' , 'paused' , 'closed')) DEFAULT 'active',
               current_number INTEGER DEFAULT 0,
               is_favorite INTEGER DEFAULT 0,
               created_at INTEGER NOT NULL,
               updated_at INTEGER NOT NULL,
               FOREIGN KEY (business_id) REFERENCES users(id) ON DELETE CASCADE
             );
          `);

          //queue entry tables 
        
           this.db.runSync(`
             CREATE TABLE IF NOT EXISTS queue_entries (
               id TEXT PRIMARY KEY,
               queue_id TEXT NOT NULL,
               user_id TEXT NOT NULL,
               ticket_number INTEGER NOT NULL,
               status TEXT CHECK(status IN('waiting' , 'called' , 'served' , 'cancelled' , 'no_show')) DEFAULT 'waiting',
               priority INTEGER DEFAULT 0,
               joined_at INTEGER NOT NULL,
               called_at INTEGER,
               served_at INTEGER,
               cancelled_at INTEGER,
               estimated_wait_time INTEGER,
               notes TEXT,
               FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
             );
          `);


          //queue history table for analytics 

           this.db.runSync(`
            CREATE TABLE IF NOT EXISTS queue_history (
               id INTGER PRIMARY KEY AUTOINCREMENT,
               queue_id TEXT NOT NULL,
               user_id TEXT NOT NULL,
               ticket_number INTEGER NOT NULL,
               wait_time INTEGER,
               service_time INTEGER,
               status TEXT NOT NULL,
               joined_at INTEGER NOT NULL,
               completed_at INTEGER NOT NULL,
               rating INTEGER CHECK(rating >= 1 AND rating <= 5),
               feedback TEXT,
               FOREIGN KEY (queue_id) REFERENCES queues(id),
               FOREIGN KEY (user_id) REFERENCES users(id)
            );
          `);


          //notification tables 

          this.db.runSync(`
            CREATE TABLE IF NOT EXISTS notifications (
               id TEXT PRIMARY KEY,
               user_id TEXT NOT NULL,
               title TEXT NOT NULL,
               message TEXT NOT NULL,
               type TEXT NOT NULL,
               data TEXT,
               is_read INTEGER DEFAULT 0,
               created_at INTEGER NOT NULL,
               FOREIGN KEY (user_id) REFERENCES users(id) on DELETE CASCADE
            ); 
          `);


        // creating indexes for queries 

         this.createIndexes();
       } 

       private  createIndexes() : void {

         const indexes = [
           'CREATE INDEX IF NOT EXISTS idx_queues_business_id ON queues(business_id)',
           'CREATE INDEX IF NOT EXISTS idx_queues_status ON queues(status)',
           'CREATE INDEX IF NOT EXISTS idx_queue_entries_queue_id ON queue_entries(queue_id)',
           'CREATE INDEX IF NOT EXISTS idx_queue_entries_user_id ON queue_entries(user_id)',
           'CREATE INDEX IF NOT EXISTS idx_queue_entries_status ON queue_entries(status)',
           'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
          
           
         ];

        indexes.forEach(indexSQL => {
          this.db.runAsync(indexSQL);
        });
      }


      //generic query methods for tables  



    // run method

   public async runAsync(sql : string , params : any[] = []) : Promise<SQLite.SQLiteRunResult> {
          try {
             return await this.db.runAsync(sql , params);
          } catch(error) {
             console.error("Query error:" , error , sql , params);
             throw error;
          }
      }

      //getting first response 


      public async getFirstAsync<T>(sql : string , params : any[] = []) : Promise<T | null> {
          try {
             const result = await this.db.getFirstAsync<T>(sql , params);
             return result || null;
          } catch(error) {
             console.error("Query error:" , error , sql , params);
             throw error;
          }
      }

      // getting all response method  

      public async  getAllAsync<T>(sql : string , params : any[] = []) : Promise<T[]> {
          try {
             return await this.db.getAllAsync<T>(sql , params);
          } catch(error) {
             console.error("Query error:" , error , sql , params);
             throw error;
          }
      }

      // db transaction support 

      public async withTransactionAsync<T>(callback : () => Promise<T>) : Promise<T>  {

          const result = await callback();

          //direct retruning result after transaction happened

          try {
             return result;

          } catch(error) {
              console.error("Transaction error:" , error);
              throw error;
          }
      }


      // utillity methods 

      //1. clearing all data 

      public async clearAllData() : Promise<void> {

          const tables = [
             'notifications',
             'queue_history',
             'queue_entries',
             'queues',
             'users',
          ];


          for(const table of tables) {
             await this.db.runAsync(`DELETE FROM ${table}`);
          }

          console.log("All data cleared");
      }


      //getting db information 

      public async getDatabaseInfo() {
          const tables = await this.getAllAsync<{name : string}>(
             "SELECT name FROM sqlite_master WHERE type='table'  ORDER BY name"
          );

          return {
             name : DB_NAME,
             version : DB_VERSION,
             tables : tables.map(t => t.name),
          };
      }


      public getDatabase() : SQLite.SQLiteDatabase {
          return this.db;
      }
    };


 // exporting db instance 
 
    export const databaseService = DatabaseService.getInstance();

    
    export default DatabaseService;

   

 

 








