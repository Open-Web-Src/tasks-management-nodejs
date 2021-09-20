const { ObjectId } = require('mongoose').Types;

module.exports = class Repository {
    constructor(database) {
        this.database = database;
    }

    /**
     * Saving some specific field in updated entity
     * @param {*} entityModel 
     * @returns Promise of saved entity
     */
    save = entityModel => {
        return new Promise((resolve, reject) => {
            let result = entityModel.save();
            resolve(result);
        });
    }

    /**
     * Create a new entity
     * @param {*} entity 
     * @returns Promise of inserted entity
     */
    create = (entity) => {
        return new Promise((resolve, reject) => {
            let result = this.database(entity).save();
            resolve(result);
        });
    }

    /**
     * Find an entity by Id
     * @param {*} id 
     * @returns Promise of found entity
     */
    getById = (id) => {
        return new Promise((resolve, reject) => {
            let result = this.getOne({ _id: ObjectId(id) });
            resolve(result);
        });
    }

    /**
     * Update specific fields of an entity by Id
     * @param {*} id
     * @param {*} fields 
     * @returns Promise of updated entity
     */
    updateById = (id, fields) => {
        return new Promise((resolve, reject) => {
            let result = this.updateOne({ _id: ObjectId(id) }, fields);
            resolve(result);
        });
    }

    /**
     * Delete an entity by Id
     * @param {*} id 
     * @return Promise of deleted entity
     */
    deleteById = (id) => {
        return new Promise((resolve, reject) => {
            let result = this.deleteOne({ _id: ObjectId(id) });
            resolve(result);
        });
    }

    /**
     * Create bunch of entity
     * @param {*} listEntity 
     * @returns Promise of listEntity
     */
    createMany = (listEntity) => {
        return new Promise((resolve, reject) => {
            let result = this.database.insertMany(listEntity);
            resolve(result);
        });
    }

    /**
     * Get the first one entity in collection matching filtering condition
     * @param filters
     * @returns Promise of matched entity
     */
    getOne = (filters = {}) => {
        return new Promise((resolve, reject) => {
            let result = this.database.findOne(filters);
            resolve(result);
        });
    }

    /**
     * Get all entity in collection matching filtering conditions
     * @param filters
     * @returns Promise of List of entity
     */
     getMany = (filters = {}) => {
        return new Promise((resolve, reject) => {
            let result = this.database.find(filters);
            resolve(result);
        });
    }

    /**
     * Update specific fields of an filtered entity
     * @param {*} filter 
     * @param {*} fields 
     * @returns Promise of updated entity
     */
    updateOne = (filters, fields) => {
        return new Promise((resolve, reject) => {
            this.database.updateOne(filters, fields)
                .then(result => {
                    const updatedDocument = this.getOne(filters);
                    resolve(updatedDocument);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Update specific fields of bunch of filtered entity
     * @param {*} filters 
     * @param {*} fields 
     * @returns Promise of list updated entity
     */
    updateMany = (filters, fields) => {
        return new Promise((resolve, reject) => {
            this.database.updateMany(filters, fields)
                .then(result => {
                    const updatedDocuments = this.getMany(filters);
                    resolve(updatedDocuments);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    /**
     * Delete an filtered entity
     * @param {*} filters 
     * @returns Promise of deleted entity
     */
    deleteOne = (filters) => {
        return new Promise(async (resolve, reject) => {
            const deletedDocument = await this.getOne(filters);
            this.updateOne(filters, 
                {
                    isDeleted: true,
                    deletedAt: new Date()
                }
            );
            resolve(deletedDocument);
        });
    }

    /**
     * Delete bunch of filtered entity
     * @param {*} filters 
     * @returns Promise of list deleted entity
     */
    deleteMany = (filters) => {
        return new Promise(async (resolve, reject) => {
            const deletedDocuments = await this.getOne(filters);
            this.updateMany(filters,
                {
                    isDeleted: true,
                    deletedAt: new Date()
                }
            );
            resolve(deletedDocuments);
        });
    }

    /**
     * Delete an filtered entity
     * @important this function will delete permanently
     * @param {*} filters 
     */
    deleteOneForever(filters) {
        return new Promise(async (resolve, reject) => {
            const result = await this.database.deleteOne(filters);
            resolve(result);
        });
    }

    /**
     * Delete bunch filtered entity
     * @important this function will delete permanently
     * @param {*} filters 
     */
    deleteManyForever(filters) {
        return new Promise(async (resolve, reject) => {
            const result = this.database.deleteMany(filters);
            resolve(result);
        }); 
    }
}