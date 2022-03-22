import express from 'express';
import { engine } from 'express-handlebars';
import { writeFile, readFile, existsSync } from 'fs';
import chalk from 'chalk';

const app = express();
const database = './database.json';

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.urlencoded({
    extended: false
}))


app.use('/assets', express.static('assets'));

app.get('/check-file', (req, res) => {
    if (existsSync(database)) {
        console.log(chalk.cyan('Failas egzistuoja'));
        res.send('Failas egzistuoja');
    } else {
        console.log(chalk.red('Failo nėra'));
        res.send('Failo nėra');
    }
})

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/add-user', (req, res) => {
    if (Object.keys(req.body).length > 0) {
        if (
            req.body.vardas === '' ||
            req.body.pavarde === '' ||
            req.body.adresas === '' ||
            req.body.telefonas === '' ||
            req.body.elPastas === ''
        ) {
            res.render('add-user', {
                message: 'Užpidyti ne visi laukai', status: 'lightgrey'
            })
            return
        } else {
            if (existsSync(database)) {

                // Jeigu failas yra 

                readFile(database, 'utf8', (err, data) => {
                    let dataArray = JSON.parse(data);

                    // Auto increment
                    if (dataArray.length === 0) {
                        req.body.id = 0;
                    } else {
                        req.body.id = dataArray[dataArray.length - 1].id + 1;
                    }

                    dataArray.push(req.body);

                    writeFile(database, JSON.stringify(dataArray), 'utf8', (err) => {
                        if (!err) {
                            res.render('add-user', {
                                message: 'Duomenys sėkmingai išsaugoti', status: 'lightgreen'
                            })
                            return
                        } else {
                            console.log(err)
                        }
                    });
                });
            } else {

                // Jeigu failo nėra

                let masyvas = [];

                req.body.id = 0;

                masyvas.push(req.body);

                writeFile(database, JSON.stringify(masyvas), 'utf8', (err) => {
                    if (!err) {
                        res.render('add-user', {
                            message: 'Duomenys sėkmingai išsaugoti', status: 'lightgreen'
                        })
                        return
                    } else {
                        console.log(err)
                    }
                });
            }
        }
    }
});

// Vartotojo redagavimas
app.get('/edit-user/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo');
            return
        }
        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);

        if (jsonId === -1) {
            res.send('Nepavyko rasti tokio elemento');
            return
        }
        res.render('edit-user', { data: json[jsonId] });
    })
});

app.post('/edit-user/:id', (req, res) => {
    let id = req.params.id;

    if (Object.keys(req.body).length > 0) {
        if (
            req.body.vardas === '' ||
            req.body.pavarde === '' ||
            req.body.adresas === '' ||
            req.body.telefonas === '' ||
            req.body.elPastas === ''
        ) {
            res.render('edit-user', {
                message: 'Užpidyti ne visi laukai', status: 'lightgrey'
            })
            return
        } else {
            readFile(database, 'utf8', (err, data) => {
                let dataArray = JSON.parse(data);

                const jsonId = dataArray.findIndex((el) => el.id == id);

                if (jsonId === -1) {
                    res.send('Nepavyko rasti tokio elemento');
                    return
                }
                req.body.id = id;
                dataArray[jsonId] = req.body;

                writeFile(database, JSON.stringify(dataArray), 'utf8', (err) => {
                    if (!err) {
                        res.redirect('http://localhost:3002/');
                        return
                    } else {
                        console.log(err)
                    }
                })
            })
        }
    }
});

// Vartotojo panaikinimas
app.delete('/:id', (req, res) => {
    let id = req.params.id;
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo');
            return
        }
        // Iššifruojame json informaciją atgal į javascriptą
        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);
        if (jsonId === -1) {
            res.send('Nepavyko rasti tokio elemento');
            return
        }

        json.splice(jsonId, 1);
        let jsonString = JSON.stringify(json);

        writeFile(database, jsonString, 'utf8', (err) => {
            if (err) {
                res.send('Nepavyko įrašyti failo');
            } else {
                res.send('Failas sėkmingai išsaugotas');
            }
        })
    })
});

app.get('/', (req, res) => {
    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo');
            return
        }
        let duomenys = JSON.parse(data);
        res.render('data', { duomenys });
    })
})

app.listen(3002);
