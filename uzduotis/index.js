import { readFile, writeFile } from 'fs';
import express from 'express';

const app = express();
const people = './people.json';

app.use(express.urlencoded({
    extended: false
}))

readFile(people, 'utf8', (err, data) => {
    let peopleArray = JSON.parse(data);


    peopleArray.forEach(person => {
        if (person.gender == "female") {
            person.favoriteFruit = "cherries";
        } else if (person.gender == "male") {
            person.favoriteFruit = "oranges";
        }
    });

    writeFile(people, JSON.stringify(peopleArray), 'utf8', (err) => {
        if (err) {
            console.log("Kuriant failą įvyko klaida");
        }
        else { console.log("Failas sėkmingai išsaugotas") }
    });
});
// -------------------------------------------------------------------------------------------------
app.get('/edit-person/:id', (req, res) => {
    let id = req.params.id;
    let person = [];
    readFile(people, 'utf8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo');
            return
        }
        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);

        if (jsonId === -1) {
            res.send('Nepavyko rasti elemento su tokiu id');
            return
        } else {
            person.push(json[jsonId]);
        }
        writeFile(people, JSON.stringify(person), 'utf8', (err) => {
            if (!err) {
                res.send("Visi elementai su kitokiu nei " + id + " ID - ištrinti");
                return
            } else {
                console.log(err)
            }
        })
    })
});

app.get('/edit-person/:id/:name', (req, res) => {
    let id = req.params.id;
    let name = req.params.name;
    let person = [];
    readFile(people, 'utf8', (err, data) => {
        if (err) {
            res.send('Nepavyko perskaityti failo');
            return
        }
        const json = JSON.parse(data);

        const jsonId = json.findIndex((el) => el.id == id);

        if (jsonId === -1) {
            res.send('Nepavyko rasti elemento su tokiu id');
            return
        } else {
            json[jsonId].name = name;
            person.push(json[jsonId]);
        }
        writeFile(people, JSON.stringify(person), 'utf8', (err) => {
            if (!err) {
                res.send("Visi elementai su kitokiu nei " + id + " ID - ištrinti, vartotojo vardas pakoreguotas");
                return
            } else {
                console.log(err)
            }
        })
    })
})

app.listen(3002);