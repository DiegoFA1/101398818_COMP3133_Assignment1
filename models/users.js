const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
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

userSchema.post('init', function(doc) {
    console.log('%s has been initialized from the db', doc._id);
});

userSchema.post('validate', function(doc) {
    console.log('%s has been validated (but not saved yet)', doc._id);
});

userSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

userSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
