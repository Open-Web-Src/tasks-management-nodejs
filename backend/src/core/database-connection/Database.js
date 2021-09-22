const mongoose = require('mongoose');

module.exports = class Database {
    constructor(connection){
        this.connection = connection;

        //returns the document as it was after update was applied
        mongoose.set('returnOriginal', false);
        
        return mongoose.connect(this.connection);
    }
}
