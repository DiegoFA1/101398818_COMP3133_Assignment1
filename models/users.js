const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
});

userSchema.pre('save', function(next) {
    
    if (!this.isModified('password')) {
        return next();
    }
    
    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    });

});



const User = mongoose.model('User', userSchema);
module.exports = User;