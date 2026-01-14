const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'data', 'tradermind_data.xlsx');

if (!fs.existsSync(filePath)) {
    console.log('File does not exist');
    process.exit(1);
}

const workbook = xlsx.readFile(filePath);
workbook.SheetNames.forEach(sheetName => {
    console.log(`--- Sheet: ${sheetName} ---`);
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(JSON.stringify(data, null, 2));
});
