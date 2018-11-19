let base_path = __dirname;
base_path= base_path.replace('config','');

module.exports = {

    /*
    |--------------------------------------------------------------------------
    | Database Connection
    |--------------------------------------------------------------------------
    | If you want create the diffrent connection then you will add the pakage name 
    | default db connection with the mysql . Mysql connection run on mysql2promise package.
    | You need add the package npm install --save mysql2
    | If you want to create connection with mongo db then u will create the connection with mongo db as well 
    | just change the database_connection to mongodb and package npm install mongodb --save
    | Support :- mysql , mongodb
    |
    */
   
    database_connection:'mysql',

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services your application utilizes. Set this in your ".index" file.
    |
    */

    env : 'dev',

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | Root Path of the application
    |
    */

    root_path :base_path ,

    /*
    |--------------------------------------------------------------------------
    | Application Email
    |--------------------------------------------------------------------------
    |
    | Config of the mail you can set the need to add the package nodemailer
    | url : https://nodemailer.com/about/
    |
    */

    mail_auth:{
        service: 'gmail',
        auth: {
          user: 'pankaj.cqlsys@gmail.com',
          pass: '123@pankaj'
        }
      },

    /*
    |--------------------------------------------------------------------------
    | Application Port
    |--------------------------------------------------------------------------
    |
    | configration of application of the port
    |
    */   
     App_port:3063,

      /*
    |--------------------------------------------------------------------------
    | Application api End point
    |--------------------------------------------------------------------------
    |
    | configration of api end point. which access of the api url
    |
    */   
   API_ENDPOINT:'/api/v1/' 
}