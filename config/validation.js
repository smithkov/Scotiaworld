const Joi = require('joi');

module.exports{
  basic :function(){
     let schema = Joi.object().keys({
       name: Joi.string().min(3).max(30).required()
   })
   return schema;
 },
 institution:function(){
     let schema = Joi.object().keys({
     firstname: Joi.string().min(3).max(30).required(),
     lastname: Joi.string().min(3).max(30).required(),
     dob: Joi.date().format('DD-MM-YYYY').options({ convert: false }),
   })
   return schema;
 }
}
