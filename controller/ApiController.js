const Db = require('../lib/sqlBulider');
const $this = require('../lib/app.method');
const AppController = require('../controller/AppController');
const App = new AppController;
const DB= new Db();

class ApiController extends AppController {

	constructor (){
		super();
	}

	async first_step (req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				key:req.body.key,
				type:req.body.type,
				checkexist:2
			}	
			const non_required= {
				authorization_key:super.create_auth()
			}
			let message='';
			if (required.type==1){
				required.phone=required.key;
				required.phone_otp=111111;
				message="The OTP code sent to your phone number";
			} else if(required.type==2){
				required.email=required.key;
				required.email_otp=111111;
				message="The OTP code sent to your email id";
			}

			let requestdata = await App.vaildObject(required,non_required);
			let conditions='';
			if (requestdata.type == 1){
				conditions=" users.phone= '" + requestdata.phone+"'";
			} else {
				conditions=" users.email= '" + requestdata.email+"'";;
			}

			let query="select * from users where "+ conditions;
			let serverdata = await DB.first(query);
			if(serverdata.length > 0) {
				if((serverdata[0].email_verify==1 ||  serverdata[0].phone_verify==1)  && serverdata[0].password!='') {
					throw (requestdata.type==1) ? "The Phone is already registered. Kindly use anothe":"The Email is already registered. Kindly use another";
				}else{
					requestdata.id=serverdata[0].id;
				}
			}
			if(requestdata.type==2) {
				let mail = {
					from: 'admin@Postapp.com',
					to: requestdata.email,
					subject: 'Postapp Verification Code ('+ new Date()+')',
					text: 'Your one time Password is '+requestdata.email_otp+' Please Dont share with any one.Thanks You Team Postapp'
				};
				$this.send_mail(mail);
			}

			await DB.save('users',requestdata);
			res.status(200).json({
				'success': true,
				'message': message,
				'code': 200,
				'body': {authorization_key:requestdata.authorization_key}
			});
		} catch(err){
			$this.error(res,err);
		}
	}
	async verify_otp(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				otp:req.body.otp,
				checkexist:1
			}	
			const non_required= {
				device_type:req.body.device_type,
				device_token:req.body.device_token,
				type:req.body.type
			}
			let requestdata = await App.vaildObject(required,non_required);
			if(requestdata.type==1){
				if(requestdata.otp!=requestdata.users.forgot_password){
					throw "Wrong otp";	
				}
			}else{
				if(requestdata.users.email!='' && requestdata.users.email_verify==0){
					if(requestdata.otp==requestdata.users.email_otp){
						requestdata.users.email_verify=1;
					}else{
						throw "Wrong otp";
					}
				}else if(requestdata.users.phone!='' && requestdata.users.phone_verify==0){
					if(requestdata.otp==requestdata.users.phone_otp){
						requestdata.users.phone_verify=1;	
					}else{
						throw "Wrong otp";		
					}
				}
			}
			requestdata.users.authorization_key=super.create_auth();
			DB.save('users',requestdata.users);
			res.status(200).json({
				'success':true,
				'message':'otp Verfication sucessfull',
				'code':200,
				'body':requestdata.users
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async update_password(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				password:req.body.password,
				checkexist:1
			}	
			const non_required= {
				device_type:req.body.device_type,
				device_token:req.body.device_token
			}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.users.password=requestdata.password;
			DB.save('users',requestdata.users);
			res.status(200).json({
				'success':true,
				'message':'Password Updated sucessfull',
				'code':200,
				'body':requestdata.users
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async first_three (req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				key:req.body.key,
				type:req.body.type,
				checkexist:1
			}	
			const non_required= {
				authorization_key:super.create_auth()
			}
			let message='';
			if(required.type==1){
				required.phone=required.key;
				required.phone_verify=1;
				message="Phone Register successfully";
			}else if(required.type==2){
				required.email=required.key;
				required.email_verify=1;
				message="Email Register successfully";
			}
			let requestdata = await App.vaildObject(required,non_required);
			if(requestdata.users.email!='' && requestdata.users.email_verify==1 && requestdata.type==2){
				throw "Your Email already verify";
			}else if (requestdata.users.phone!='' && requestdata.users.phone_verify==1 && requestdata.type==1){
				throw "Your Phone already verify";
			}
			if(requestdata.type==2){
				requestdata.users.email=requestdata.email;
			}else if(requestdata.type==1){
				requestdata.users.phone=requestdata.phone;
			}
			requestdata.id = requestdata.users.id;
			requestdata.users.authorization_key = requestdata.authorization_key;
			DB.save('users',requestdata);
			res.status(200).json({
				'success':true,
				'message':message,
				'code':200,
				'body':requestdata.users
			});
		}catch(err){
			$this.error(res,err);
		}
	}


	async update_profile(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				checkexist:3
			}	
			const non_required= {
				name:req.body.name
			}
			let requestdata = await App.vaildObject(required,non_required);
			console.log(requestdata);
			requestdata.users.name= requestdata.name;
			DB.save('users',requestdata.users);
			res.status(200).json({
				'success':true,
				'message':"Profile updated successfully",
				'code':200,
				'body':requestdata.users
			});
		}catch(err){
			$this.error(res,err);
		}
	}


	async login(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				email:req.body.email,
				password:req.body.password,
				checkexist:2
			}	
			const non_required= {
				device_type:req.body.device_type,
				device_token:req.body.device_token,
				authorization_key:super.create_auth()
			}
			let requestdata = await App.vaildObject(required,non_required);

			let login= await DB.find('User','all',{
				conditions:{
					'or':{
						email:requestdata.email,
						phone:requestdata.email
					}
				}
			});
			let user='';
			if(login.length>0){
				user=login[0];
				if(user.password!=requestdata.password){
					throw "Wrong Password";
				}
				user.authorization_key=requestdata.authorization_key;
				user.device_type=requestdata.device_type;
				user.device_token=requestdata.device_token;
				DB.save('users',user);
			}else{
				throw "Wrong Email or phone";
			}
			res.status(200).json({
				'success':true,
				'message':"Login Successfully",
				'code':200,
				'body':user
			});
		}catch(err){
			$this.error(res,err);
		}
	}
	async forgot_password(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				key:req.body.key,
				type:req.body.type,
				forgot_password:111111,
				checkexist:2
			}	
			const non_required= {}
			let message='';
			if(required.type==1){
				required.phone=required.key;
				message="The OTP code sent to your phone number";
			}else if(required.type==2){
				required.email=required.key;
				message="The OTP code sent to your email id";
			}
			let requestdata = await App.vaildObject(required,non_required);
			let users = await DB.find('User','all',{
				conditions:{
					or:{
						email:requestdata.key,
						phone:requestdata.key
					}
				}
			});
			console.log(users);
			if(users.length==0){
				throw "Email or phone not resgister";
			}
			users[0].forgot_password=requestdata.forgot_password;
			if(requestdata.type==2){
				let mail = {
					from: 'admin@Postapp.com',
					to: requestdata.email,
					subject: 'Forgot Password otp Code ('+ new Date()+')',
					text: 'Your one time Password is '+requestdata.forgot_password+' Please Dont share with any one.Thanks You Team Postapp'
				};
				$this.send_mail(mail);
			}
			DB.save('users',users[0]);
			res.status(200).json({
				'success':true,
				'message':message,
				'code':200,
				'body':{authorization_key:users[0].authorization_key}
			});
		}catch(err){
			$this.error(res,err);
		}
	}		
	async resend_otp(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				type:req.body.type,
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			let message='';
			if(requestdata.type==2){
				message="The OTP code sent to your Email id";
				let mail = {
					from: 'admin@Postapp.com',
					to: requestdata.users.email,
					subject: 'Forgot Password otp Code ('+ new Date()+')',
					text: 'Your one time Password is '+requestdata.users.email_otp+' Please Dont share with any one.Thanks You Team Postapp'
				};
				$this.send_mail(mail);
			}
			else if(requestdata.type==3){
				message="The OTP code sent to your phone number";
				let mail = {
					from: 'admin@Postapp.com',
					to: requestdata.users.email,
					subject: 'Forgot Password otp Code ('+ new Date()+')',
					text: 'Your one time Password is '+requestdata.users.forgot_password+' Please Dont share with any one.Thanks You Team Postapp'
				};
				$this.send_mail(mail);
			}
			res.status(200).json({
				'success':true,
				'message':message,
				'code':200,
				'body':[]
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async soical_login(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				social_type:req.body.social_type,
				social_id:req.body.social_id,
				email:req.body.email,
				email_verify:1,
				checkexist:2
			}	
			const non_required= {
				name:req.body.name,
				profile_pic:req.body.profile_pic,
				authorization_key:super.create_auth(),
				device_type:req.body.device_type,
				device_token:req.body.device_token
			}
			let requestdata = await App.vaildObject(required,non_required);
			let conditions='';
			if(requestdata.social_type==1){
				conditions=" or id_google='"+requestdata.social_id+"'";	
			}else if(requestdata.social_type==2){
				conditions=" or id_facebook='"+requestdata.social_id+"'";
			}else if(requestdata.social_type==3){
				conditions=" or id_twiter='"+requestdata.social_id+"'";
			}else{
				throw "Please Select the correct social_type";
			}
			let query="select * from users where email='"+requestdata.email+"'"+conditions;
			let query_data=await DB.first(query);
			if(query_data.length>0){
				requestdata.id=query_data[0].id;
			}
			for(let data in requestdata){
				if(requestdata[data]==undefined){
					delete requestdata[data];
				}
			}
			let _data = await DB.save('users',requestdata);
			let _new_query ="select * from users where id=";
			if(typeof requestdata.id!='undefined'){
				_new_query+=requestdata.id;
			}else{
				_new_query+=_data;
			}
			let result=await DB.first(_new_query);
			res.status(200).json({
				'success':true,
				'message':"Login successfully",
				'code':200,
				'body':result[0]
			});
		}catch(err){
			$this.error(res,err);
		}
	}

}
module.exports = ApiController;