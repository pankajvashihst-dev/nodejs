
const ApiController=require('../controller/ApiController');
const Config = require('../config/config');
let api = new ApiController;
module.exports = function(app){ 
    app.route(Config.API_ENDPOINT+'step_one').post(api.first_step);
    app.route(Config.API_ENDPOINT+'verify_otp').put(api.verify_otp);
    app.route(Config.API_ENDPOINT+'update_password').put(api.update_password);
    app.route(Config.API_ENDPOINT+'first_three').post(api.first_three);
    app.route(Config.API_ENDPOINT+'login').post(api.login);
    app.route(Config.API_ENDPOINT+'update_profile').put(api.update_profile);
    app.route(Config.API_ENDPOINT+'forgot_password').post(api.forgot_password);
    app.route(Config.API_ENDPOINT+'resend_otp').post(api.resend_otp);
    app.route(Config.API_ENDPOINT+'soical_login').post(api.soical_login);
}

