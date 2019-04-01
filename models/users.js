var mongoose = require('mongoose');
var bcrypt = require("bcryptjs");



var UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            index: true
        },
        password: { type: String },
        email: { type: String },
        name: { type: String }
    }
)

const User = module.exports = mongoose.model('User', UserSchema);

User.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

User.getUserByUsername=function(username,callback){
    var query={username:username};
    User.findOne(query,callback)
}

User.comparePassword=function(password,hash,callback){
    bcrypt.compare(password,hash,function(err,isMatch){
        if (err) throw err;
        callback(null,isMatch);
    })
}

User.getUserById=function(id,callback){
    User.findById(id,callback);

}