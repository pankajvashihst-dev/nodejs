
module.exports = {
	
	/**
	 * Database configuration class.
	 *
	 * You can specify multiple configurations for production, development and testing.
	 *
	 * datasource => The name of a supported datasource; valid options are as follows:
	 *  Database/Mysql - MySQL 4 & 5,
	 *  Database/Sqlite - SQLite (PHP5 only),
	 *  Database/Postgres - PostgreSQL 7 and higher,
	 *  Database/Sqlserver - Microsoft SQL Server 2005 and higher
	 *
	 * You can add custom database datasources (or override existing datasources) by adding the
	 * appropriate file to app/lib/Database. Datasources should be named 'database.js',
	 *
	 *
	 * persistent => true / false
	 * Determines whether or not the database should use a persistent connection
	 *
	 * host =>
	 * the host you connect to the database. To add a socket or port number, use 'port' => #
	 */

	default:{
		host : 'localhost',
		user : 'root',
		password : 'SYstme123@@',
		database : 'post_app'
	},
	test:{
		host : 'localhost',
		user : 'root',
		password : 'SYstme123@@',
		database : 'post_app'
	}
	
}






