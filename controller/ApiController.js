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
				if((serverdata[0].email_verify==1 ||  serverdata[0].phone_verify==1 || serverdata[0].id_google!=0 || serverdata[0].id_facebook!=0 || serverdata[0].id_twiter!=0)  && serverdata[0].password!='') {
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
			//console.log(login);
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
			//res.json(err);
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
				message="OTP sent on EMAIL";
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
			}else{
				message="OTP sent on Phone";
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

	async add_address(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				sender_name:req.body.sender_name,
				address_line_1:req.body.address_line_1,
				address_line_2:req.body.address_line_2,
				city:req.body.city,
				state:req.body.state,
				zip_code:req.body.zip_code,
				country:req.body.country,
				latitude:req.body.latitude,
				longitude:req.body.longitude,
				type:req.body.type,
				is_default:1,
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.user_id=requestdata.users.id;
			let id =await DB.save('users_addresses',requestdata);
			requestdata.id=id;
			let update_query="update users_addresses SET is_default=0 where id != "+id+" and  user_id = "+requestdata.user_id;
			DB.Query(update_query,'update');
			delete requestdata.users;
			res.status(200).json({
				'success':true,
				'message':"Address added successfully",
				'code':200,
				'body':requestdata
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async get_address(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				type:parseInt(req.params.type),
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.user_id=requestdata.users.id;
			let condition={
				'conditions' :{
					'user_id':requestdata.user_id,
					'type':requestdata.type,
				}
			};
			let result=await DB.find('Address','all',condition);
			delete requestdata.users;
			res.status(200).json({
				'success':true,
				'message':"Address Listing",
				'code':200,
				'body':result
			});
		}catch(err){
			$this.error(res,err);
		}
	}
	/** api for create the post  ***/
	async create_post(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				data:req.body,
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			let total_price=0;
			for(let price in requestdata.data.product_details){
				if(requestdata.data.product_details[price].amount){
					total_price+=requestdata.data.product_details[price].amount;
				}else{
					let message="Amount filed is missing product_details at position "+JSON.stringify(requestdata.data.product_details[price]);
					throw {code:400,message};
				}
			}
			let complete_data={
				addresses:requestdata.data.address,
				product_details:requestdata.data.product_details,
				user_id:requestdata.users.id,
				amount:total_price
			};
			let last_insert_id= await DB.save('create_posts',complete_data);
			complete_data.id=last_insert_id; 
			complete_data.status=0; 
			res.status(200).json({
				'success':true,
				'message':"Create Post",
				'code':200,
				'body':complete_data
			});
		}catch(err){
			$this.error(res,err);
		}
	}
	/** api for get the post  ***/
	async get_post(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.user_id=requestdata.users.id;
			let condition={
				'conditions' :{
					'user_id':requestdata.user_id,
				}
			};
			let result=await DB.find('CreatePost','all',condition);
			delete requestdata.users;
			for(let i =0; i<result.length;i++ ){
				result[i].addresses=JSON.parse(result[i].addresses);
				result[i].product_details=JSON.parse(result[i].product_details);
			}	
			res.status(200).json({
				'success':true,
				'message':"Address Listing",
				'code':200,
				'body':result
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async update_post(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				create_post_id:req.body.create_post_id,
				checkexist:2
			}	
			const non_required= {
				sender_address_id:req.body.sender_address_id,
				receiver_address_id:req.body.receiver_address_id,
				transaction_number:req.body.transaction_number,
				status:req.body.status,
				is_payment_done:req.body.is_payment_done
			}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.id=	requestdata.create_post_id;	
			DB.save('create_posts',requestdata);
			res.status(200).json({
				'success':true,
				'message':"Post data updated",
				'code':200,
				'body':requestdata
			});
		}catch(err){
			$this.error(res,err);
		}
	}

		/** get additonal servers   ***/
	async post_servers(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				checkexist:2
			}	
			const non_required= {}
			let requestdata = await App.vaildObject(required,non_required);
			requestdata.user_id=requestdata.users.id;
			let result=await DB.Query('select * from additional_services','select');
			delete requestdata.users;
			res.status(200).json({
				'success':true,
				'message':"Post services",
				'code':200,
				'body':result
			});
		}catch(err){
			$this.error(res,err);
		}
	}

	async update_address(req,res){
		try{
			const required = {
				security_key:req.headers.security_key,
				authorization_key:req.headers.authorization_key,
				address_id:req.body.address_id,
				checkexist:2
			}	
			const non_required= {
				sender_name:req.body.sender_name,
				address_line_1:req.body.address_line_1,
				address_line_2:req.body.address_line_2,
				city:req.body.city,
				state:req.body.state,
				zip_code:req.body.zip_code,
				country:req.body.country,
				is_default:req.body.is_default,
			}
			let requestdata = await App.vaildObject(required,non_required);
			console.log(requestdata);
			requestdata.id=parseInt(requestdata.address_id);
			await DB.save('users_addresses',requestdata);
			if(requestdata.is_default==1 && typeof requestdata.is_default!='undefined' ){
				let update_query="update users_addresses SET is_default=0 where id != "+requestdata.id+" and  user_id = "+requestdata.users.id;
			    DB.Query(update_query,'update');
			}
			 delete requestdata.users;
			res.status(200).json({
				'success':true,
				'message':"Address updated successfully",
				'code':200,
				'body':requestdata
			});
		}catch(err){
			$this.error(res,err);
		}
	}

}
module.exports = ApiController;