const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'files'), function (err, files) {
    if (err) {
        throw err;
    } else {
        fs.rm(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
            if (err) fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {if (err) throw err});
            fs.mkdir(path.join(__dirname, 'files-copy'),
            { recursive: true },
            (err) => {
                if (err) throw err;
                stdout.write('Directory created!\n');
            });
            files.forEach(file => {
                const readStream = fs.createReadStream(path.join(__dirname, 'files', file));
                let data = '';
                readStream.on('data', chunk => {
                    data += chunk;
                });
                readStream.on('end', () => fs.writeFile(path.join(__dirname, 'files-copy', file),
                data,
                (err) => {
                    if (err) throw err;
                    stdout.write('File ' + file + ' copied!\n');
                }))
            });     
        })
    };
});


