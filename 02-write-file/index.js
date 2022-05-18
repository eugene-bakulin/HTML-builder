const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = process;

fs.writeFile(path.join(__dirname, 'text.txt'),'', err => {if (err) throw err});

stdout.write('Hello. Please enter the text you would like to write to the file.\n');

stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        stdout.write('Goodbye!');
        process.exit();
    } else {
        fs.appendFile(path.join(__dirname, 'text.txt'),
        data,
        err => {
            if (err) throw err;
        })
    }      
});

process.on('SIGINT', () => {
    stdout.write('Goodbye!');
    process.exit();
});
