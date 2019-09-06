module.exports.csvJSON = (csv) => {
    return new Promise((resolve) => {
        csv = csv.toString();

        // Get Header
        const lines = csv.split("\n");
        const result = [];
        const headers = lines[0].split(",");

        for(let line in lines) {
            const currentLine = lines[line].split(",");
            const lineObject = {};

            for(let value in currentLine) {
                lineObject[ headers[value] ] = currentLine[value];
            }

            result.push(lineObject);
        }

        resolve(result);
    })
}

module.exports.jsonCSV = (json) => {
    return new Promise((resolve) => {
        let csv = "";
        
        //Get Header
        const keys = Object.keys(json[0]);
        const header = keys.join(',');
        csv += `${header}\n`;
        json.shift()

        for(let row in json) {
            const values = Object.values(json[row]);
            csv += `${values}\n`;
        }
        resolve(csv);
    })
}

