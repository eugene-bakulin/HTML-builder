const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, function (err, items) {
    if (err) {
        throw err;
    } else {
        fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'),'', err => {if (err) throw err});
        const onlyCSS = items.filter(item => {
            if (item.isFile() && (path.extname(item.name) === '.css')) {
                return true;
            }
        });
        onlyCSS.forEach(file => {
            const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
            let data = '';
            readStream.on('data', chunk => {
                data += chunk;
            });
            readStream.on('end', () => fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'),
            data + '\n',
            (err) => {
                if (err) throw err;
            }))
        });
    }
    stdout.write('bundle.css with merged styles created!\n');
});