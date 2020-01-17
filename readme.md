STORM JSON-RPC
---------------

JSON-RPC server for interacting with Storm test framework. Thirdparty tools can post custom JSON messages to this Storm-JSONRPC server to trigger the test executions , so it will bridge with Storm and perform the validation.

Uses tests available in https://github.com/WebPlatformForEmbedded/Storm-Testcases .

Getting started

Install the dependencies

    npm install

Start Storm json rpc server

    npm start
    
Test Execution

For executing test using curl command follow below steps

Request Type :POST
Sample command:
 curl --request POST --header 'Content-type: application/json' --header 'Accept: application/json' --data '{"jsonrpc":"2.0","id":1,"method":"execute_testcase","params":{"test":"thunder-controller-duplicate.test.js","execid":"RPI_Storm-20200103095005","device":{"host":"192.168.0.10"}}}' http://127.0.0.1:9099/storm-jsonrpc
 
 
JSON message details 

{"jsonrpc":"2.0","id":1,"method":"execute_testcase","params":{"test":"thunder-controller-duplicate.test.js","execid":"RPI_Storm-20200103095005","device":{"host":"10.26.48.240"}}}

“jsonrpc” field specifies json rpc version

“id” id parameter is to keep track of which response goes with which request>response will contain same id

“method” method name to be executed,we use execute_testcase method for executing test

Params: parameters passed to the method (execute_testcase)
We have three params 
   a)test : for specifying the test name for execution eg: thunder-controller-duplicate.test.js
   b)execid :unique id for tracking each execution
   c)device: device details on where the test is to be executed






