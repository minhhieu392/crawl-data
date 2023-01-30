import path from 'path';
import systemService from '../services/system.service';
const { addLogs, loadLogs } = systemService;
// addLogs({
//     filePath: path.resolve(process.cwd(),'logs','info.txt'),
//     logs: [{
//         username: '123456789',
//         email: 'toanhkma@gmail.com',
//         phone: '096423282X',
//         description: 'hi'
//     }]
// }).then().catch()
loadLogs({
        filePath: path.resolve(process.cwd(),'logs','info.txt'),
}).then((result)=>{
    console.log(result);
})