import fs from 'fs'
import path from 'path'

function writeFile(data, testCaseLogFile, serverLogFile) {
    fs.appendFile(testCaseLogFile, data+'\n', (err) => {
	                    if (err) throw err;
    });
    process.stdout.write = process.stderr.write = serverLogFile.write.bind(serverLogFile);
}

export default (testCaseLog, stormJsonrpcLog) =>{
var testCaseLogFile = testCaseLog;
var serverLogFile = stormJsonrpcLog;
return {
  init(test) {
        var data = 'Starting test `' + test.title + '`'
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  step(test, step) {
        var data = 'Starting step `' + step.description + '`'
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  log() {
	var data ='    ' + [...arguments]
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  sleep(milliseconds) {
	var data = 'Sleeping for ' + milliseconds / 1000 + ' seconds'
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  pass(test, step) {
	var data ='Step `' + step.description + '` passed'
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  fail(test, step, err) {
	var data ='Step  `' + step.description + '` failed ' + err
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  success(test) {
	var data = 'Success ' + test.title
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  error(test, err) {
	var data = 'Error ' + test.title + err
        writeFile(data, testCaseLogFile, serverLogFile)
  },
  finished(test) {
	var data = 'Test ' + test.title + ' finished running'
        writeFile(data, testCaseLogFile, serverLogFile)
  },
}
}
