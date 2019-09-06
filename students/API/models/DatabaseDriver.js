const fs = require('fs') 
const isEqual = require('../utils/index')

const DatabaseDriver = class DatabaseService {
    constructor() {
        this.path = `API/models/Database.json`  
    }

    // If this was production we'd use transform streams otherwise the memory consumption would crash it very easily
     _readFile(){
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, (err, data) => {
                if(err) reject(err);
                const returnData = Buffer.from(data).toString('utf8')
                resolve(JSON.parse(returnData));
            })
        })
    }

    _writeFile(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.path, data, (err, data) => {
                if(err) reject(err);
                resolve(data);
            })
        })
    }

    find(obj = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const database = await this._readFile();
                const returnValue = database.filter((e) => {
                    if(obj.dob && obj.name) {
                        return obj.dob === e.dob && e.name === obj.name;
                    } else if(obj.dob) {
                        return obj.dob === e.dob;
                    } else if(obj.name) {
                        return obj.name === e.name;
                    } else {
                        return e;
                    }
                })
                resolve(returnValue);
            } catch(e) {
                console.error(e);
                reject(e);
            }
        })
    }

    delete(obj = {}) {
        return new Promise(async (resolve, reject) => {
            let database = null, returnValue = null, removeValue = null;
            
            try {
                database = await this._readFile();
            } catch(e) {
                console.error(e);
                reject(e);
            }
   
            try {
                removeValue = await this.find(obj);
            } catch(e) {
                console.error(e);
                reject(e)
            }
            
            // Short circut clearing DB for performance reasons
            if(Object.keys(obj).length === 0) {
                try {
                    await this._writeFile(JSON.stringify([]));
                    resolve({removed: database.length});
                } catch(e) { 
                    console.error(e);
                    reject(e);
                }
            }
 
            returnValue = database.map((e) => {
                if(! isEqual(removeValue[0], e) ) {
                    return e;
                }
            }).filter(e => e !== null && e !== undefined);
            
            const removed = database.length - returnValue.length;

            try {   
                await this._writeFile(JSON.stringify(returnValue));
                resolve({removed});
            } catch(e) {
                console.error(e);
                reject(e);
            }
            
        })
    }

    add(obj = {}) {
        return new Promise(async (resolve, reject) => {
            let database = null;

            try {   
                database = await this._readFile()
            } catch(e) {
                console.error(e);
                reject(e);
            }

            // Add to DB Array
            database.push(obj);

            try {
                await this._writeFile(JSON.stringify(database))
                resolve(database)
            } catch(e) {
                console.error(e)
                reject(e)
            } 
        })
    }
}

module.exports = DatabaseDriver;