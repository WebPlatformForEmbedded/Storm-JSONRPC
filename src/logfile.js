import fs from 'fs'

function writeFile(data, testCaseLogFile, serverLogFile) {
  fs.appendFile(testCaseLogFile, data + '\n', err => {
    if (err) throw err
  })
  process.stdout.write = process.stderr.write = serverLogFile.write.bind(serverLogFile)
}

export default (testCaseLog, stormJsonrpcLog) => {
  let testCaseLogFile = testCaseLog
  let serverLogFile = stormJsonrpcLog
  return {
    init(test) {
      writeFile('Starting test `' + test.title + '`', testCaseLogFile, serverLogFile)
    },
    step(test, step) {
      writeFile('Starting step `' + step.description + '`', testCaseLogFile, serverLogFile)
    },
    log() {
      let data = ['  ', ...arguments]
      data = JSON.stringify(data)
      data = data.substring(data.indexOf(',') + 1).split(']')
      data = '    ' + data[0]
      writeFile(data, testCaseLogFile, serverLogFile)
    },
    sleep(milliseconds) {
      writeFile('Sleeping for ' + milliseconds / 1000 + ' seconds', testCaseLogFile, serverLogFile)
    },
    pass(test, step) {
      writeFile('Step `' + step.description + '` passed', testCaseLogFile, serverLogFile)
    },
    fail(test, step, err) {
      writeFile('Step  `' + step.description + '` failed ' + err, testCaseLogFile, serverLogFile)
    },
    success(test) {
      writeFile('Success ' + test.title, testCaseLogFile, serverLogFile)
    },
    error(test, err) {
      writeFile('Error ' + test.title + err, testCaseLogFile, serverLogFile)
    },
    finished(test) {
      writeFile('Test ' + test.title + ' finished running', testCaseLogFile, serverLogFile)
    },
  }
}
