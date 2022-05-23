const fs = require('fs');
const path = require('path');
const { stdout } = process;

fs.mkdir(path.join(__dirname, 'project-dist'),
{ recursive: true },
(err) => {
    if (err) throw err;
    // -----------------------------css--------------------------------------
    fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, function (err, items) {
        if (err) {
            throw err;
        } else {
            fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'),'', err => {if (err) throw err});
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
                readStream.on('end', () => fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'),
                data + '\n' + '\n',
                (err) => {
                    if (err) throw err;
                }))
            });
        }
        stdout.write('\n- -\nstyle.css in ' + path.join(__dirname, 'project-dist') + ' with merged styles created! \n- -\n');
    });

    // -----------------------------assets--------------------------------------

    function copyDir(dir) {
        fs.readdir(path.join(__dirname, dir), {withFileTypes: true}, function (err, items) {
            if (err) {
                throw err;
            } else {
                fs.rm(path.join(__dirname, 'project-dist', dir), {recursive: true}, (err) => {
                    if (err) {
                        fs.mkdir(path.join(__dirname, 'project-dist', dir), {recursive: true}, (err) => {
                            if (err) throw err;
                        });
                    }
                        fs.mkdir(path.join(__dirname, 'project-dist', dir),
                        { recursive: true },
                        (err) => {
                            if (err) throw err;
                            stdout.write('Directory ' + path.join(__dirname, 'project-dist', dir) + ' created! \n- -\n');
                            
                        });
                        items.forEach(item => {
                            if (item.isFile()) {
                                fs.copyFile(path.join(__dirname, dir, item.name), path.join(__dirname, 'project-dist', dir, item.name), (err) => {
                                    if (err) throw err;
                                    stdout.write('File ' + item.name + ' copied to directory ' + path.join(__dirname, 'project-dist', dir) + '! \n- -\n');
                                });
                            } else if (item.isDirectory()) {
                                copyDir(path.join(dir, item.name));
                            }
                        })    
                });
            }
        })     
    }

    copyDir('assets');

    // -----------------------------html--------------------------------------

    async function f() {

        await fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'),'', (err) => {
            if (err) throw err;
        })
        
        let newContent = '';
        let componentName = '';
        
        let dataTempl = await fs.promises.readFile(path.join(__dirname, 'template.html'), (err) => {
            if (err) throw err;
        });
        let matching = await dataTempl.toString().match(/{?{\w{1,20}}?}/g);
            
        async function compObj () {
            let arr = [];
                for (let match of matching) {
                componentName = match.slice(2, match.length-2) + '.html';
                arr.push({
                    'compName': match,
                    'inner': await fs.promises.readFile(path.join(__dirname, 'components', componentName), 'utf-8'),
                })
            }
            return arr;   
        }

        let components = await compObj();
        
        newContent = await dataTempl.toString().replaceAll(/{?{\w{1,20}}?}/g, function (match) {
            for (let component of components) {
                if (component['compName'] === match) {
                    return component['inner'];
                }
            }
        })
        fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), newContent, (err) => {if (err) throw err});
    }
    f();
});