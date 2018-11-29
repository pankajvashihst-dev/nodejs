
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
    app.route(Config.API_ENDPOINT+'address').post(api.add_address);
    app.route(Config.API_ENDPOINT+'address/:type').get(api.get_address);
    app.route(Config.API_ENDPOINT+'address').put(api.update_address);
    app.route(Config.API_ENDPOINT+'create_post').post(api.create_post);
    app.route(Config.API_ENDPOINT+'create_post').get(api.get_post);
    app.route(Config.API_ENDPOINT+'create_post').put(api.update_post);
    app.route(Config.API_ENDPOINT+'post_servers').get(api.post_servers);
}

