var  Database = require('./database.js');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
async = require("async");
var  Validate = require('./validateInput.js');
var connect='';
const nodemailer = require('nodemailer');
module.exports = class Helper extends Validate{
	constructor(){
		super();
		this.db = new Database();
		connect=this.db;
		this.data=false;
		
	 }
	 
	 crypt(password){
		 const hash = crypto.createHmac('md5', password)
                                        .update('')
                                        .digest('hex');
		return hash;
	 }

	image_Upload (image) {
		if(image)	{
			
			var extension = path.extname(image.file.name); 
			var filename =  uuid()+extension;
			var sampleFile = image.file;
			

			 sampleFile.mv(process.cwd()+'/public/images/users/' + filename,(err)=>{
				if(err)throw err;
				
				
			 });
			
				return filename;
	    }
	}

	image_Uploads (image,already_files) { //file upload
		try{
			if(image)	{
				var oldPath = image.image.path;
				var extension = path.extname(image.image.originalFilename); 
		        var filename =  uuid()+extension;
		        var newPath = process.cwd()+'/public/images/users/' + filename;
		    		fs.rename(oldPath, newPath, function (err) {	
		        
						if (err) throw err;	
						if(already_files !=''){
							console.log(already_files);
							fs.unlink(process.cwd()+'/public/images/users/' + already_files);
						}
					});
					return filename;
		    }
		}catch(err){
			throw err;
		}
	}


	create_auth ()
	{
		try{
			let current_date = (new Date()).valueOf().toString();
			let random = Math.random().toString();
			return crypto.createHash('sha1').update(current_date + random).digest('hex');
		}catch(err){
			throw err;
		}
	}

async check_auths (data, callback)
{
	try{
		let rows = '';
		const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and authorization_key=? and security_key=?', ['0',data.auth_key,data.security_key]);
		if(row){
			rows = row;   
		}
		callback(rows);
	}catch(err){
		throw err;
	}
}

    
	
async vaildObject(required,non_required,res){
		let message = '';
		let empty=[];
		let table_name = (required.hasOwnProperty('table_name'))?required.table_name:'users';
		for(let key in required){
			if(required.hasOwnProperty(key)){
				if(required[key]==undefined || required[key]==''){
					empty.push(key);
				}
			}
		}

		if(empty.length!=0){
			message= empty.toString();
			if(empty.length>1){
				message+=" fields are required"
			}else{
				message+=" field is required"
			}
			res.status(400).json({
				'success':false,
				'error_message':message,
				'code':400,
				'body':[]
			});		
			return;
		}else{
			if(required.hasOwnProperty('password')){
				required.password = this.crypt(required.password);
			}
			if(required.hasOwnProperty('auth_key')){
						if(!await this.checking_availability(required.auth_key,'authorization_key',table_name)){
							message="invalid auth key" ;
							res.status(403).json({
								'success':false,
								'error_message':message,
								'code':403,
								'body':[]
							});		
							return false;
						}
					}
			if(required.hasOwnProperty('checkexit')){
				if(required.checkexit===1){
					if(required.hasOwnProperty('email')){
						if(await this.checking_availability(required.email,'email',table_name)){
							message="this email is already register kindly use another" ;
							res.status(403).json({
								'success':false,
								'error_message':message,
								'code':403,
								'body':[]
							});		
							return false;
						}
					}
					
				}
			}

			const marge_object = Object.assign(required, non_required);
			delete marge_object.checkexit;
			return  marge_object;		
}
}

async checking_availability(value,key,table_name){
	
	const[row,field] = await connect.db_connect.execute(`select * from ${table_name} where ${key} = "${value}"` );
	if(row.length>0){
		return true;
	}else{
		return false;
	}
}
	 
};