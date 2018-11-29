

class CreatePost {
    constructor() {
        this.table_name = "create_posts"; 
        this.validation={
            "address":{
                "from":{
                "country":{ type: String, required: true },
                "state":{ type: String, required: false },
                "city":{ type: String, required: false },
                "zip_code":{ type: String, required: false },
            },"to":{
                "country":{ type: String, required: true },
                "state":{ type: String, required: false },
                "city":{ type: String, required: false },
                "zip_code":{ type: String, required: false }
            }
        },
            "user_id":{ type: Number, required: true },
            "amount":{type: Number, required: true}
         }
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
module.exports = CreatePost;