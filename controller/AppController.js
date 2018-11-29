const crypto = require('crypto');
const Db = require('../lib/sqlBulider');
const DB = new Db;
module.exports = class AppController {
    constructor() {
        console.log('app controller run');
    }
    async vaildObject(required, non_required) {
        try {
            let message = '';
            let empty = [];
            let table_name = (required.hasOwnProperty('table_name')) ? required.table_name : 'users';
            for (let key in required) {
                if (required.hasOwnProperty(key)) {
                    if (required[key] == undefined || required[key] == '') {
                        empty.push(key);
                    }
                }
            }
            if (empty.length != 0) {
                message = empty.toString();
                if (empty.length > 1) {
                    message += " fields are required"
                } else {
                    message += " field is required"
                }
                throw {code: 400, message};
            }
            if (required.hasOwnProperty('security_key')) {
                if (required.security_key != 'POSTAPP') {
                    throw "Not Access the api";
                }
            }
            if (required.hasOwnProperty('checkexist') && required.checkexist === 1) {
                if (required.hasOwnProperty('email')) {
                    if (await this.checking_availability('email', required.email, table_name)) {
                        throw "The Email is already registered. Kindly use another";
                    }
                }
                if (required.hasOwnProperty('phone')) {
                    if (await this.checking_availability('phone', required.phone, table_name)) {
                        throw "The Phone No is already registered. Kindly use another";
                    }
                }
                if (required.hasOwnProperty('username')) {
                    if (await this.checking_availability('username', required.username, table_name)) {
                        throw "username already exits";
                    }
                }
            }
            if (required.hasOwnProperty('authorization_key')) {
                let auth_key = await this.check_auth('authorization_key', required.authorization_key, table_name);
                if (auth_key) {
                    required.users = auth_key;
                } else {
                    throw {code: 401, message: "invaild authorization_key"};
                }
            }
            let final_data = Object.assign(required, non_required);
            if (final_data.hasOwnProperty('password')) {
                final_data.password = crypto.createHash('sha1').update(final_data.password).digest('hex');
            }

            console.log("checking request data", final_data);
            for (let data in final_data) {
                if (final_data[data] == undefined) {
                    delete final_data[data];
                } else {
                    if (typeof final_data[data] == 'string') {
                        final_data[data] = final_data[data].trim();
                    }
                }
            }
            return final_data;
        } catch (err) {
            throw err;
            exit;
        }
    }

    async checking_availability(key, value, table_name) {
        let query = "select * from " + table_name + " where `" + key + "` = '" + value + "' limit 1";
        let data = await DB.first(query);
        if (data) {
            return true;
        } else {
            return false;
        }
    }

    async check_auth(key, value, table_name) {
        let query = "select * from " + table_name + " where `" + key + "` = '" + value + "' ";
        let data = await DB.first(query);
        if (data) {
            return data[0];
        } else {
            return false;
        }
    }

    create_auth() {
        let key = 'abc' + new Date().getTime();
        return crypto.createHash('sha1').update(key).digest('hex');
    }

}