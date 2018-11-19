const mysql = require("mysql2/promise");
const DatabaseConfig = require('../config/database');
const config = require('../config/config');




    /*
    |--------------------------------------------------------------------------
    | Application LIB Connection managment
    |--------------------------------------------------------------------------
    |
    | first import the all config file and database file from the config folder and manage connection 
    |
    */
module.exports = class Database {
	constructor(){
		if(config.database_connection==='mysql'){
			console.log(DatabaseConfig.default);
			this.db_connect= mysql.createPool(DatabaseConfig.default);
		    this.db_connect.getConnection(function(err) {
			this.db_connect = this.db_connect.promise();
			if (err) throw err;
		 	 console.log("Connected!");
		});
		this.connection=this.db_connect;
		}else if(config.database_connection==='mongodb'){

		}else{
			console.error("you select the wrong the db connection. please change in config file");
		}
		
     }
}
