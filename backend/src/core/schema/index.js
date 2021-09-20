const mongoose = require("mongoose");

module.exports = class BaseSchema extends mongoose.Schema {

    constructor(configuration){
      super(configuration);

      this.enableTimeStamp();
      this.enableSoftDelete();
      this.enableNonDeletedBasedSelection();
    }

    enableTimeStamp() {
      // If you set timestamps: true, Mongoose will add `createdAt` & `updatedAt`
      // Update updatedAt every time document being updated
      this.set("timestamps", true);
    }

    enableSoftDelete() {
      //Implement soft-delete for Mongoose Schema
      this.add({
        isDeleted: {
          type: Boolean,
          required: true,
          default: false,
        },
        deletedAt: {
          type: Date,
          default: null,
        },
      });
    }

    enableNonDeletedBasedSelection(){
      //Only get non-deleted documets, filter it by isDeleted = false
      const middlewareTypes = ['find', 'findOne', 'updateOne', 'updateMany'];
      middlewareTypes.forEach(type => {
        this.pre(type, function(next) {
          this.where({isDeleted: false});
          next();
        });
      })
    }
  }