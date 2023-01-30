"use strict";
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const loadLogs =  async({ filePath }) => {
    return new Promise(async(resolve,reject)=>{
        let log;
        try {
            if (!fs.existsSync(filePath)){
                await fs.appendFileSync(filePath,'')
            }
          log = await fs.readFileSync(filePath).toString();
          log = log.split("\r\n");
          log = _.compact(log);
          log = log.map((line) => {
              return JSON.parse(line);
          });
          log = _.uniqBy(log,'link');
          return resolve(log);
        } catch (e) {
          return reject(e)
        }
    });
}
const addLogs= async ({filePath, logs}) => {
    return new Promise(async(resolve,reject)=>{
        try {
            if (!fs.existsSync(filePath)){
                await fs.appendFileSync(filePath,'')
            }
            let data ='';
            let currentlogs = await loadLogs({filePath});
            if (!logs) {
                logs = []
            }
            let newLogs = [...currentlogs,...logs];
            newLogs = _.uniqBy(newLogs,'link');
            newLogs = _.compact(newLogs);
            newLogs.map((log => {
                data += JSON.stringify(log)+'\r\n';
            }));
            await fs.writeFileSync(filePath,data);
            return resolve(newLogs);
        } catch(e){
            return reject(e)
        }
    });
    
}

module.exports = {
        loadLogs,
    addLogs
}
// export default { 
//     loadLogs,
//     addLogs
// }


