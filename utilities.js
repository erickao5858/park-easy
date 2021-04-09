/**
 * Print error log in red color
 * @param {string} title Error type
 * @param {string} tip Error tips
 * @param {string} code Error code
 */
const errorLog = (title, tip, code) => {
    console.log('\033[31m' + title)
    console.log('\033[31m' + tip)
    console.log('\033[31m' + 'Error code: ' + code)
}

module.exports={
    errorLog: errorLog
}