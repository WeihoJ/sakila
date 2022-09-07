'use strict';



const path = require('path');
const express = require('express');
const app = express();

const { port, host } = require('./config.json');

const Tietovarasto = require('./sqlvarasto/tietovarastokerros');
const varasto = new Tietovarasto();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ejsVarasto'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) =>
    varasto
        .haeKymmenen('Uusi')
        .then((vastaus) =>
            res.render('index', {
                kieli: 'fi',
                otsikko: 'Sakila',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/lisaaElokuva', (req, res) => {
    res.render('lisaaElokuva', {
        kieli: 'fi',
        otsikko: 'Lisää elokuva',
    });
});

app.post('/talletatiedot', async (req, res) => {
    try {
        const elokuva = req.body;
        // console.log(elokuva)
        varasto.lisaaElokuva(elokuva).then((vastaus) =>
            res.render('hakuTulos', {
                kieli: 'fi',
                haku: elokuva.title,
                otsikko: 'Sakila',
                vastaus: vastaus,
            })
        );
        // const status=await varasto.lisaa(elokuva);
    } catch (virhe) {
        console.log(virhe);
    }
});

app.get(
    '/hakuTulos',
    (req, res) =>
        varasto
            .haeElokuvat(req.query.search)
            .then((vastaus) =>
                res.render('hakuTulos', {
                    kieli: 'fi',
                    haku: req.query.search,
                    otsikko: 'Sakila',
                    vastaus: vastaus,
                })
            )
            .catch((virhe) => console.warn(virhe))
    // console.log(req._parsedUrl.query)
    // console.log(req.query.search)
);

app.get('/suodatin', (req, res) =>
    varasto
        .haeKaikki()
        .then((vastaus) =>
            res.render('suodatin', {
                kieli: 'fi',
                otsikko: 'Kaikki elokuvat',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/toiminta', (req, res) =>
    varasto
        .haeKategoria('Action')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Toiminta',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/animaatio', (req, res) =>
    varasto
        .haeKategoria('Animation')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Animaatio',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/lapsi', (req, res) =>
    varasto
        .haeKategoria('Children')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Lapsille',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/klassikko', (req, res) =>
    varasto
        .haeKategoria('Classics')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Klassikko',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/komedia', (req, res) =>
    varasto
        .haeKategoria('Comedy')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Komedia',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/dokumentti', (req, res) =>
    varasto
        .haeKategoria('Documentary')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Dokumentti',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/draama', (req, res) =>
    varasto
        .haeKategoria('Drama')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Draama',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/perhe', (req, res) =>
    varasto
        .haeKategoria('Family')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Perhe',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/ulkomaalainen', (req, res) =>
    varasto
        .haeKategoria('Foreign')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Ulkomaalaiset',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/pelit', (req, res) =>
    varasto
        .haeKategoria('Games')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Pelit',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/kauhu', (req, res) =>
    varasto
        .haeKategoria('Horror')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Kauhu',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/musiikki', (req, res) =>
    varasto
        .haeKategoria('Music')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Musiikki',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/uusi', (req, res) =>
    varasto
        .haeKategoria('New')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Uutuus',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/scifi', (req, res) =>
    varasto
        .haeKategoria('Sci-Fi')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Sci-Fi',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/urheilu', (req, res) =>
    varasto
        .haeKategoria('Sports')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Urheilu',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.get('/matkailu', (req, res) =>
    varasto
        .haeKategoria('Travel')
        .then((vastaus) =>
            res.render('kategoria', {
                kieli: 'fi',
                otsikko: 'Matkailu',
                vastaus: vastaus,
            })
        )
        .catch((virhe) => console.warn(virhe))
);

app.listen(port, host, () => console.log(`${host}:${port} 👌`));
