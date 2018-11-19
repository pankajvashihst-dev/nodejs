module.exports = class User {

    constructor() {
        this.table_name = "users"; 
      }

    get belongto(){
        return relation = {
            Address:{
                table_name: 'addresses',
                forgin_key : 'user_id',
                fields:'*',
                limit:'20',
                condition:''
            }
        };
     } 

}