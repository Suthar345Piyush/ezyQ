// config file  

import 'dotenv/config';

export default {
   ...require('./app.json'),

   expo :  {
      ...require('./app.json').expo,

      extra : {
         googleAndroidClientId : process.env.GOOGLE_ANDROID_CLIENT_ID,
      },
   }
};

