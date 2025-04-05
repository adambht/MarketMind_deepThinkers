const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Obligatoire
    },
    email: {
        type: String,
        required: true,
        unique: true, // Empêche l'enregistrement d'un email en double
    },
    password: {
        type: String,
        required: true,
    },
    birthDate: {  // Renommé pour correspondre au backend
        type: Date,
        required: true,
    },
    phone: {  // Renommé pour correspondre au backend
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
