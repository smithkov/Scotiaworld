var error = {
   err : function(errorDescription){
    return  new Error(errorDescription);
  },
  noId:"Such Id does not exist"
}
module.exports = error;
