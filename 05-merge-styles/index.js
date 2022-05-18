const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'styles'), function (err, items) {
    if (err) {
        throw err;
    } else {
        const onlyCSS = items.filter(item => item.isFile() && path.extname(item) === '.css');
        onlyCSS.forEach(file => {
            const readStream = fs.createReadStream(path.join(__dirname, 'styles', file));
            let data = '';
            readStream.on('data', chunk => {
                data += chunk;
            });
            readStream.on('end', () => fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'),
            data,
            (err) => {
                if (err) throw err;
                stdout.write('bundle.css created!');
            }))
        });     
    }
});