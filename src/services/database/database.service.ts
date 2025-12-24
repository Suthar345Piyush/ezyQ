// whole sqlite db logic here 

import * as SQLite from "expo-sqlite";


//db configuration 

const DB_NAME = 'ezyQ.db';
const DB_VERSION = 1;


export class DatabaseService {
    private static instance : DatabaseService;
    private db : SQLite.SQLiteDatabase;


    //creating a constructor  

    private constructor() {
       this.db = SQLite.openDatabaseSync(DB_NAME);
       this.initializeTables();
    }


    //taking our created db instance 
    // if we don't have instance , then creating it and returning it  

    private static getInstance() : DatabaseService {
       if(!DatabaseService.instance) {
          DatabaseService.instance = new DatabaseService();
       }

       return DatabaseService.instance;
      
    }


    //initializing all tables,always wrapped them into try/finally statement
    
    private initializeTables() : void {
       try {

          // users table  

          this.db.execSync(`
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

          this.db.execSync(`
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
        
          this.db.execSync(`
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

          this.db.execSync(`
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


          //business settings table 

          this.db.execSync(`
            CREATE TABLE IF NOT EXISTS business_settings (
               id TEXT PRIMARY KEY,
               business_id TEXT UNIQUE NOT NULL,
               operating_hours TEXT,
               notification_enabled INTEGER DEFAULT 1,
               auto_call_next INTEGER DEFAULT 0,
               max_queues INTEGER DEFAULT 5,
               allow_booking INTEGER DEFAULT 1,
               booking_advance_days INTEGER DEFAULT 7,
               settings_json TEXT,
               FOREIGN KEY (business_id) REFERENCES users(id) on DELETE CASCADE
            );
          `);

          //notification tables 

          this.db.execSync(`
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

          //favorites table  

          this.db.execSync(`
           CREATE TABLE IF NOT EXISTS favorites (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             user_id TEXT NOT NULL,
             queue_id TEXT NOT NULL,
             created_at INTEGER NOT NULL,
             UNIQUE(user_id , queue_id),
             FOREIGN KEY (user_id) REFERENCES users(id) on DELETE CASCADE,
             FOREIGN KEY (queue_id) REFERENCES queues(id) on DELETE CASCADE
           );
        `);

        // creating indexes for queries 

        this.createIndexes();

        console.log('DB tables initialized');
       } 
       catch(error) {
         console.error('Error in initializing DB tables:', error);
         throw error;
       }
    }


    private createIndexes() : void {

       const indexes = [
         'CREATE INDEX IF NOT EXISTS idx_queues_business_id ON queues(business_id)',
         'CREATE INDEX IF NOT EXISTS idx_queues_status ON queues(status)',
         'CREATE INDEX IF NOT EXISTS idx_queue_entries_queue_id ON queue_entries(queue_id)',
         'CREATE INDEX IF NOT EXISTS idx_queue_entries_user_id ON queue_entries(user_id)',
         'CREATE INDEX IF NOT EXISTS idx_queue_entries_status ON queue_entries(status)',
         'CREATE INDEX IF NOT EXISTS idx_queue_history_queue_id ON queue_history(queue_id)',
         'CREATE INDEX IF NOT EXISTS idx_queue_history_user_id ON queue_history(user_id)',
         'CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)',
         'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)',
         'CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id)',
       ];

       indexes.forEach(indexSQL => {
         this.db.execSync(indexSQL);
       });

    }

    // query methods for tables 

    
   // 1. method for running query  
   
    public runQuery(sql : string , params : any[] = []) : SQLite.SQLiteRunResult {
       try{
         return this.db.runSync(sql , params);
       } catch(error) {
          console.error('Query error:' , error , sql , params);
          throw error;
       }
    }


    //2.  get one method to execute single query 

    public getOne<T>(sql : string , params : any[] = []) : T | null {
       try {
          return this.db.getFirstSync<T>(sql , params) || null;
       } catch(error) {
          console.error("Query error:" , error , sql , params);
          throw error;
       }
    }

    //3. method to execute all query at once 

    public getAll<T>(sql : string , params : any[] = []) : T[] {
       try {
          return this.db.getAllSync<T>(sql , params);
       } catch(error) {
          console.error('Query error:' , error , sql , params);
          throw error;
       }
    }


    //4. db transaction method 

    public async transaction(callback : () => void) : Promise<void> {
       try {
          await this.db.withTransactionAsync(async () => {
             callback();
          });
       } catch(error) {
          console.error('Transaction error:' , error);
          throw error;
       }
    };


    // 5. clearing all data 

    public clearAllData() : void {

       const tables = [
          'notifications',
          'favorites',
          'queue_histroy',
          'queue_entries',
          'business_settings',
          'queues',
          'users',
       ];

       tables.forEach(table => {
         this.db.execSync(`DELETE FROM ${table}`);
       });


       console.log("All data cleared");
    }

    // dropping all the tables  

    public dropAllTables() : void {
       
      const tables = [
         'notifications',
         'favorites',
         'queue_histroy',
         'queue_entries',
         'business_settings',
         'queues',
         'users',
      ];

      tables.forEach(table => {
          this.db.execSync(`DROP TABLE IF EXISTS ${table}`);
      });

      console.log("All tables dropped");
    }

    //getting db instance 

    public getDatabase(): SQLite.SQLiteDatabase {
       return this.db;
    }

    // db information 

    public getDatabaseInfo() {
       const tables = this.db.getAllSync<{name : string}>(
          "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
       );


       return {
          name : DB_NAME,
          version : DB_VERSION,
          tables : tables.map(t => t.name),
       };
    }
};


//exporting single instance 

export const db = DatabaseService.getInstance();



