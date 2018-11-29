/*
* v 0.0.1
* author pankaj vashisht
* email sharmapankaj688@gmai.com
*/
const DbConnection = require('./database');
const config = require('../config/config');
const fs = require('fs');
const path = '../model/';
module.exports = class Query {
	constructor(){
		this.db = new DbConnection;
	 }

	 async find(table_name,type,...condition){
		 if(typeof condition[0]=='undefined'){
			condition[0]=[];
		 }
		if (fs.existsSync(config.root_path+'model/'+table_name+'.js')) {
			console.log("model found");
			let models =  require('../model/'+table_name);
			let infomation = new models;
			let table=table_name;
			if(typeof infomation.table_name  !== 'undefined'){
				 table = infomation.table_name;
			}
			let query = "select";
			
			if(typeof condition[0].fields != 'undefined'){
				let fields = condition[0].fields.toString();
				query+=" "+fields;
			}else{
				query+=" * ";
			}
			query+=" from "+ table ;
			// console.log(query);
			if(typeof condition[0].conditions != 'undefined'){
				query+=" where ";
				let its_first =0;
				for(let c in condition[0].conditions){
					if(c=='or'){
					
						for(let a in  condition[0].conditions[c]){
							if(its_first==0){
								query+= " `"+table+"`.`"+a+ "` = '"+condition[0].conditions[c][a]+"'"; 
							}else{
								query+=" or `"+table+"`.`"+a+ "` = '"+condition[0].conditions[c][a]+"' ";  
							}
							its_first++;
						}
					}else{
						if(its_first==0){
							query+= "`"+table+"`.`"+c+ "` = '"+condition[0].conditions[c]+"'"; 
						}else{
							query+=" and `"+table+"`.`"+c+ "` = '"+condition[0].conditions[c]+"'";  
						}
						its_first++;
					}
				}
			}
			
			if(typeof condition.group != 'undefined' ){
				// ADD LOGIIC THERE
			}
			if(typeof condition.limit != 'undefined' ){
				// ADD LOGIIC THERE
			}
			console.log(query);
			const[row,fields] =await this.db.db_connect.execute(String(query));
			if(row.length>0){
				if(type=='first'){
					return row[0];
				}else{
					return row;
				}
			}else{
				return [];
			}
			
		}else{
			let query ="select * from "+table_name;
			const[row,fields] =await this.db.db_connect.execute(query);
			return row;
		}
	} 

	async findall(query){
		query = String(query);
		console.log(query);
		const[row,fields] =await this.db.db_connect.execute(query);
		return row;
	}

	async first(qry) {
		const query = String(qry);
		try {
			const[row,fields] = await this.db.db_connect.execute(query);

			if(row.length > 0){
				return row;
			}
	
			return false;
		} catch (e) {
			console.log('Error: ===>', e);
			e.code=400;
			e.message="My sql error";
			throw e;
			exit;
		}
	}
	async Query(query,type){
			try{
				query = String(query);
				console.log(query);
				const [rows, fields] = await this.db.db_connect.execute(query);
				if(rows){
					if(type=='select'){
						return rows;
					}else if(type=='insert'){
						return rows.insertId;
					}else if(type=='update'){
						return rows.insertId;
					}
				}else{
					return [];
				}
			}catch(err){
				console.log('Error: ===>', e);
				err.message=JSON.stringify(err);
				err.code=400;
				throw err;
				exit;
			}
	}
	async save(table_name,object){
		if(!object.hasOwnProperty('id')){
			object.created= parseInt(new Date().getTime()/1000);
		}
		object.modified= parseInt(new Date().getTime()/1000);
		let get_scheme="SHOW COLUMNS FROM "+table_name;
		const[row,fields] =await this.db.db_connect.execute(String(get_scheme));
		let query='';
		if(object.hasOwnProperty('id')){
			query = "Update `"+table_name+"` SET ";
		}else{
			query = "Insert into `"+table_name+"` SET ";
		}
		let value=[];
		console.log(object);
		for(let i in row ){
			console.log(row[i].Field,object.hasOwnProperty(row[i].Field));
			if(object.hasOwnProperty(row[i].Field)){
				query += row[i].Field+' = ? ,';
				value.push(object[row[i].Field]);
			}
		}
		
		query=query.substring(',', query.length - 1);
		if(object.hasOwnProperty('id')){
			query += ' where id  =  '+object.id;
		}
		try{
			const [rows, fields] = await this.db.db_connect.execute(query,value);
			if(rows){
				return rows.insertId;
			}else{
				return [];
			}
		}catch(err){
			throw err;
			exit;
		}
	}

}
