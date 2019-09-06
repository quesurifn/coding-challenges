const fs = require('fs')
fs.readFile('./txnlog.dat', (error, data) => {
    if(error) {
        throw(error)
    }
    /*
    * Parse Out Header
    */
    const bufferArray = Buffer.from(data)
    const header = bufferArray.slice(0, 4).toString('utf8')
    const version = bufferArray.slice(4, 5).toString('hex')
    const numberOfRecords = bufferArray.slice(5, 9).readUInt32BE()

    console.log(header, version, numberOfRecords)

    let iterator = 0
    const rows = []
    let cutBuffer = bufferArray.slice(9, (bufferArray.length - 1) )

    /*
    * Here I will parse out each row
    * I could add the answers here but chose not to for the sake of cleanliness / readability 
    */

    while(iterator < numberOfRecords) {

        const type = cutBuffer.slice(0,1).toJSON().data[0]
        const timestamp =  cutBuffer.slice(1, 5).readUInt32BE()
        const userId = cutBuffer.slice(5, 13).readBigUInt64BE().toString()
        let amountInDollars = 0;

        if(type === 0 || type === 1) {

            amountInDollars = parseFloat( cutBuffer.slice(13, 21).readDoubleBE().toFixed(2) )
            cutBuffer = cutBuffer.slice(21, cutBuffer.length)

        } else {

            cutBuffer = cutBuffer.slice(13, cutBuffer.length )
        }

        rows.push({type, timestamp, userId, amountInDollars})
        iterator++
    }

    // Answer Questions Here
    const totalDollarsInDebits = parseFloat ( rows.filter(e => e.type === 0).map(e => e.amountInDollars).reduce((a,cv) => a + cv).toFixed(2) )
    const totalDollarsInCredits = parseFloat ( rows.filter(e => e.type === 1).map(e => e.amountInDollars).reduce((a,cv) => a + cv).toFixed(2) )
    const totalAutopayStarted = rows.filter(e => e.type === 2).length
    const totalAutopayEnded =  rows.filter(e => e.type === 3).length

    // Find 2456938384156277127's Balance
    let userBalance = 0;
    rows.filter(e => e.userId === "2456938384156277127" ).forEach((e) => {
        if(e.type === 0) userBalance -= e.amountInDollars
        if(e.type === 1) userBalance += e.amountInDollars
    })

    console.table({totalDollarsInDebits, totalDollarsInCredits, totalAutopayStarted, totalAutopayEnded, userBalance})

});






