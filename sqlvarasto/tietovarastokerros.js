'use strict';

const { STATUSKOODIT, STATUSVIESTIT } = require('./statuskoodit');

const Tietokanta = require('./tietokanta');

const optiot = require('./yhteysoptiot.json');

const sql = require('./sqllauseet.json');
const haeToimintaSql = sql.haeToiminta.join(' ');
const haeUusiSql = sql.haeUusi.join(' ');
const haeToimintaJaUudetSql = sql.haeToimintaJaUusi.join(' ');
const haeKaikkiSql = sql.haeKaikki.join(' ');
const haeKymmenenSql = sql.haeKymmenen.join(' ');
const haeKategoriaSql = sql.haeKategoria.join(' ');
const haeElokuvatSql = sql.haeElokuvat.join(' ');
const haeIsoinIdSql = sql.haeIsoinId.join(' ');
const lisaaElokuvaSql2 = sql.lisaaElokuva2.join(' ');
const lisaaElokuvaSql = sql.lisaaElokuva.join(' ');
const lisaaElokuvaLinkkiSql = sql.lisaaElokuvaLinkki.join(' ');

const PERUSAVAIN = sql.perusavain;

module.exports = class Tietovarasto {
    constructor() {
        this.db = new Tietokanta(optiot);
    }

    get STATUSKOODIT() {
        return STATUSKOODIT;
    }

    lisaaElokuva(elokuva) {
        return new Promise(async (resolve, reject) => {
            try {
                if (elokuva) {
                    if (
                        elokuva.title == '' ||
                        elokuva.description == '' ||
                        elokuva.release_year == '' ||
                        elokuva.language_id == '' ||
                        elokuva.rental_duration == '' ||
                        elokuva.rental_rate == '' ||
                        elokuva.length == '' ||
                        elokuva.replacement_cost == '' ||
                        elokuva.rating == '' ||
                        elokuva.last_update == ''
                    ) {
                        resolve([
                            {
                                title: 'Virhe',
                                description:
                                    'Lisäyksessä virhe! Tarkista, että kaikki kentät ovat täytetty oikeilla tiedoilla',
                                name: 'Kokeile uudestaan oikeilla tiedoilla',
                                length: 0,
                                rental_rate: '-----',
                            },
                        ]);
                    } else {
                        let isoinArvo = await this.db.suoritaKysely(
                            haeIsoinIdSql,
                            []
                        );
                        let todellinenArvo =
                            isoinArvo.kyselynTulos[0].film_id + 1;
                        await this.db.suoritaKysely(lisaaElokuvaSql, [
                            elokuva.title,
                            elokuva.description,
                            elokuva.release_year,
                            elokuva.language_id,
                            elokuva.rental_duration,
                            elokuva.rental_rate,
                            elokuva.length,
                            elokuva.replacement_cost,
                            elokuva.rating,
                            elokuva.special_features,
                            elokuva.last_update,
                        ]);
                        await this.db.suoritaKysely(lisaaElokuvaLinkkiSql, [
                            todellinenArvo,
                            elokuva.category,
                            elokuva.last_update,
                        ]);

                        resolve(this.haeElokuvat2(elokuva.title));
                    }
                } else {
                    console.log('Ei elokuvaa???');
                }
            } catch (virhe) {
                reject(virhe);
            }
        });
    }

    haeKategoria(genre) {
        return new Promise(async (resolve, reject) => {
            if (!genre) {
                reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(haeKategoriaSql, [genre,]);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(genre));
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeElokuvat(title) {
        // console.log(haeElokuvatSql, [title])
        return new Promise(async (resolve, reject) => {
            if (!title) {
                // reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
                resolve([
                    {
                        title: 'Virhe',
                        description:
                            'Ethän sä tyhjällä haulla nyt mitää tulosta odottanut saavasi? Vai oletitko?',
                        name: 'Kokeile vaikka uusiks',
                        length: 0,
                        rental_rate: '99999',
                    },
                ]);
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(
                        haeElokuvatSql,
                        `%${[title]}%`
                    );
                    // console.log(tulos.kyselynTulos);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        // reject(STATUSVIESTIT.EI_LOYTYNYT(title));
                        resolve([
                            {
                                title: 'Huomio',
                                description: `Valitettavasti hakemaasi elokuvaa (${title}) ei löytynyt`,
                                name: 'Kokeile hakea toisella nimellä',
                                length: 0,
                                rental_rate: '00000',
                            },
                        ]);
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeElokuvat2(title) {
        // console.log(haeElokuvatSql, [title])
        return new Promise(async (resolve, reject) => {
            if (!title) {
                // reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
                resolve([
                    {
                        title: 'Virhe',
                        description:
                            'Ethän sä tyhjällä haulla nyt mitää tulosta odottanut saavasi? Vai oletitko?',
                        name: 'Kokeile vaikka uusiks',
                        length: 0,
                        rental_rate: '99999',
                    },
                ]);
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(
                        haeElokuvatSql,
                        `${[title]}`
                    );
                    // console.log(tulos.kyselynTulos);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        // reject(STATUSVIESTIT.EI_LOYTYNYT(title));
                        resolve([
                            {
                                title: 'Huomio',
                                description: `Valitettavasti hakemaasi elokuvaa (${title}) ei löytynyt`,
                                name: 'Kokeile hakea toisella nimellä',
                                length: 0,
                                rental_rate: '00000',
                            },
                        ]);
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeToiminta(genre) {
        return new Promise(async (resolve, reject) => {
            if (!genre) {
                reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(haeToimintaSql);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(genre));
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeUusi(genre) {
        return new Promise(async (resolve, reject) => {
            if (!genre) {
                reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(haeUusiSql);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(genre));
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeKymmenen(genre) {
        return new Promise(async (resolve, reject) => {
            if (!genre) {
                reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
            } else {
                try {
                    const tulos = await this.db.suoritaKysely(haeKymmenenSql);
                    if (tulos.kyselynTulos.length > 0) {
                        resolve(tulos.kyselynTulos);
                    } else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(genre));
                    }
                } catch (virhe) {
                    console.log(virhe);
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }

    haeToimintaJaUusi() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.db.suoritaKysely(haeToimintaSql);
                const tulos2 = await this.db.suoritaKysely(haeUusiSql);
                if (
                    tulos.kyselynTulos.length > 0 ||
                    tulos2.kyselynTulos.length > 0
                ) {
                    resolve(tulos.kyselynTulos, tulos2.kyselynTulos);
                } else {
                    reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
                }
            } catch (virhe) {
                console.log(virhe);
                reject(STATUSVIESTIT.OHJELMAVIRHE());
            }
        });
    }

    haeKaikki() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.db.suoritaKysely(haeKaikkiSql);
                if (tulos.kyselynTulos.length > 0) {
                    resolve(tulos.kyselynTulos);
                } else {
                    reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
                }
            } catch (virhe) {
                console.log(virhe);
                reject(STATUSVIESTIT.OHJELMAVIRHE());
            }
        });
    }
};
