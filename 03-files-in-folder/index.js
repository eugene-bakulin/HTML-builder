const path = require('path');
const fs = require('fs');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, function (err, items) {
    if (err) {
        throw err;
    } else {
        const onlyFiles = items.filter(item => item.isFile());
        onlyFiles.forEach(file => {
            const baseName = path.basename(file.name, path.extname(file.name));
            const extName = path.extname(file.name).slice(1);
            fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
                if (err) {
                    throw err;
                } else {
                    stdout.write(baseName + ' - ' + extName + ' - ' + stats.size/1024 + ' kb\n');
                }
            })
        })
    }
});
