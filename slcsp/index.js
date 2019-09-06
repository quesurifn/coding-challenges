const util = require('util');
const fs = require('fs');
const { csvJSON, jsonCSV } = require('./utils/index');

(async () => {
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.writeFile);

    let plans = null, slcsp = null, zips = null;

    // Error handling isn't pertinent to one-time REPLs
    plans = await  readFile(`${__dirname}/plans.csv`);
    slcsp = await  readFile(`${__dirname}/slcsp.csv`);
    zips  = await  readFile(`${__dirname}/zips.csv`);
  
    plans = await csvJSON(plans);
    slcsp = await csvJSON(slcsp);
    zips  = await csvJSON(zips);

    /*
    * Would like only silver and then add specific-rate area and a rate as a float to 
    * make things easier when finding the result
    */
    plans = plans.filter(row => row.metal_level === 'Silver')
    .map((row) => {
        return {
            ...row,
            specific_rate_area: `${row.state}-${row.rate_area}`,
            float_rate: parseFloat(row.rate)
        }
    });

    for(let e in slcsp) {

        // Find applicable Zips and check for mixed rate classes
        const applicableZips = zips.filter(row => row['zipcode'] === slcsp[e]['zipcode']);
        const applicableZipsCheck = applicableZips.filter(row => row['rate_area'] === applicableZips[0]['rate_area']);

        // If there are NOT mixed rate classes 
        if(applicableZips.length === applicableZipsCheck.length) {
            // Filter to proper rate plan and sort to ascending 
            const applicablePlans = plans.filter(row => row['specific_rate_area'] === `${applicableZips[0]['state']}-${applicableZips[0]['rate_area']}`).sort((a ,b) => a.float_rate - b.float_rate);
            const rate = applicablePlans.length >= 2 ? applicablePlans[1]['float_rate'] : false;
            if(rate) slcsp[e]['rate'] = rate.toFixed(2);
            console.table(applicablePlans)
        } else {
            console.table(applicableZips)
        }

    }

    const newCsv = await jsonCSV(slcsp);
    await writeFile(`${__dirname}/slcsp.csv`, newCsv);

})();



