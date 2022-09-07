'use strict';

const mariadb = require('mariadb');

module.exports = class Tietokanta {
    constructor(optiot) {
        this.optiot = optiot;
    }

    suoritaKysely(sql, parametrit) {
        return new Promise(async (resolve, reject) => {
            let yhteys;
            try {
                yhteys = await mariadb.createConnection(this.optiot);
                let kyselynTulos = await yhteys.query(sql, parametrit);

                if (typeof kyselynTulos === 'undefined') {
                    reject('Kyselyvirhe');
                } else if (typeof kyselynTulos.affectedRows === 'undefined') {
                    delete kyselynTulos.meta;
                    resolve({ kyselynTulos, tulosjoukko: true });
                    // resolve({ kyselynTulos:kyselynTulos, tulosjoukko: true });
                } else {
                    resolve({
                        kyselynTulos: {
                            muutetutRivitLkm: kyselynTulos.affectedRows,
                            insertId: kyselynTulos.insertId,
                            status: kyselynTulos.warningStatus,
                        },
                        tulosjoukko: false,
                    });
                }
            } catch (virhe) {
                console.log(virhe);
                reject('SQL-virhe' + virhe);
            } finally {
                if (yhteys) yhteys.end();
            }
        });
    }
};
