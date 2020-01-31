import fs from 'fs'
import path from 'path'
import StormRunner from 'storm'

const RpcServer = require('http-jsonrpc-server');
import log from './logfile.js'

var testCasePath;

// To get the location of the testcase within testcases folder  which needs to executed
function getTestcasePath(dirPath, testCase, arrayOfFiles) {

    var files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file)
    {
        if (fs.statSync(dirPath + "/" + file).isDirectory())
        {
            arrayOfFiles = getTestcasePath(dirPath + "/" + file, testCase, arrayOfFiles)
        }
        else
        {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
            if (file == testCase) 
            {
                testCasePath = path.join(__dirname, dirPath, "/", file)
            }
        }
    })
    return arrayOfFiles
}

// To start the test case execution
function execute_testcase(params) {
    process.chdir(__dirname); 
    var log_dir = './logs';
    if (!fs.existsSync(log_dir))
    {
        fs.mkdirSync(log_dir);
    }
    testCasePath = ""
    const testCase = params.test
    const deviceIp = params.device
    const execId = params.execid
    getTestcasePath("../testcases/Storm-Testcases/src/tests/", testCase)

    var stormJsonrpcLog = fs.createWriteStream(__dirname+'/logs/'+testCase+'_'+execId+'_Serverconsole.log');

    if (!testCase || !fs.existsSync(testCasePath)) 
    {
        process.stdout.write = process.stderr.write = stormJsonrpcLog.write.bind(stormJsonrpcLog);
    	console.log('Test case ' + testCase + ' not found')
        result = 'Test case ' + testCase + ' not found'
        return result;
    }
    if (!deviceIp)
    {
        process.stdout.write = process.stderr.write = stormJsonrpcLog.write.bind(stormJsonrpcLog);
    	console.log('Device IP is not available')
        result = 'Device IP is not available'
        return result;
    }
    else 
    {
        var testCaseLog = fs.createWriteStream(__dirname+'/logs/'+testCase+'_'+execId+'_Execution.log');
        process.stdout.write = process.stderr.write = stormJsonrpcLog.write.bind(stormJsonrpcLog);
    	import(testCasePath)
    	      .then(testCase => {
    		            StormRunner(testCase.default, log(testCaseLog.path,stormJsonrpcLog), deviceIp)
    		            .then(console.log)
    		            .catch(console.error)
    		        })
    	    .catch(console.error)
    }

    var result = {'ExecutionLog':testCaseLog.path,'ServerLog':stormJsonrpcLog.path}
    return result
}

// To check the json-rpc server status
function check_rpcserver_status()
{
    if (rpcServer.server.listening)
    {
	console.log('JSON-RPC server is in listening mode');
	return 'LISTEN'
    }
    else
    {
	console.log('JSON-RPC server is not running');
	return 'DOWN'
    }
}

// To Stop the json-rpc server
function stop_rpcserver() 
{
    rpcServer.close().then(() => {
                      console.log('JSON-RPC server stopped');  
		      return 'STOPPED';
		  
    })
}

// Registering json-rpc methods and start the server
const rpcServer = new RpcServer({
	          path: '/storm-jsonrpc' ,
	          methods: {
	                      execute_testcase,
			      check_rpcserver_status,
			      stop_rpcserver,
	                   }
});
    rpcServer.setMethod('executeTest',execute_testcase);
    rpcServer.setMethod('checkRpcServer',check_rpcserver_status);
    rpcServer.setMethod('stopRpcServer',stop_rpcserver);
       
    rpcServer.listen(9091, '127.0.0.1').then(() => {
		          console.log('JSON RPC server is listening at http://:127.0.0.1:9091/storm-jsonrpc');
	
});
