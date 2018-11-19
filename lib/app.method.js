/*
* v1 
* auth pankaj vashisht @sharmapankaj688@gmail.com
* helper can used in the whole app for sending mail , push  , payment etc work.
* function with anysc , await or without anysc awit .
*/

/**
 * first import the configration file after get the all configration 
 * send mail , push , file upload etc .
 * when function cal then that file import at moment. 
 */
const config= require('../config/config');

module.exports= {

	send_mail: function(object){
		const nodemailer = require('nodemailer');
		var transporter = nodemailer.createTransport(config.mail_auth);
		var mailOptions = object;
		transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
		});
	},

	upload_pic_with_await:async function(file,folder_name=null,unlink = null){
		const fileUpload = require('express-fileupload');
		if (!file){
			return false; // if not getting the image
		}else{
			if(unlink){
			}
			let upload_path=config.root_path;
			if(folder_name){
				upload_path+folder_name;
			}
			let image = file;
			let image_array = image.mimetype.split("/");
			let extension = image_array[image_array.length - 1];
			var timestamp = parseInt(new Date().getTime());
			await image.mv(upload_path+'/'+timestamp+'.'+extension, function(err) {
				if(err){
					console.log(err);
				}else{
					console.log("file_uploaded");
				}
		   });
			return timestamp+'.'+extension;
		}
	},
	
	upload_pic: async function(){
		const fileUpload = require('express-fileupload');
		if (!file){
			return false; // if not getting the image
		}else{
			if(unlink){
			}
			let upload_path=config.root_path;
			if(folder_name){
				upload_path+folder_name;
			}
			let image = file;
			let image_array = image.mimetype.split("/");
			let extension = image_array[image_array.length - 1];
			var timestamp = parseInt(new Date().getTime());
			image.mv(upload_path+'/'+timestamp+'.'+extension, function(err) {
				if(err){
					console.log(err);
				}else{
					console.log("file_uploaded");
				}
		   });
			return timestamp+'.'+extension;
		}
	},
	send_push:function(){

	},
	send_push_apn:function(){
		
	},
	paypal:async function(){

	},
	stripe:async function(){

	},brain_tree:async function(){

	},error:function(res,err){
		let code=(typeof err==='object')? err.code:403;
			let message=(typeof err==='object')? err.message:err;
			res.status(code).json({
				'success':false,
				'error_message':message,
				'code':code,
				'body':[]
			});
	},success:function(res,data){
		res.status(200).json({
			'success':true,
			'message':data.message,
			'code':200,
			'body':data.body
		});
	}
};