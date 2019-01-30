
const express = require('express');
const fs = require('fs');
const utils = require('../helpers/utils')

module.exports = function (dirname) {
    var router = express.Router();

    router.post('/login', (req, res) => {
        try {
            utils.readDataFromDB(dirname + '/Db/user.json')
                .then((userData) => {
                    for (let i = 0; i < userData.length; i++) {
                        if (userData[i].hasOwnProperty([req.body.email])) {
                            res.status(200).send(userData[i][req.body.email])
                            break;
                        }
                        if (i == userData.length - 1) {
                            res.status(400).send('invalid user credentials')
                        }
                    }

                }).
                catch((err) => {
                    res.status(400).send(err)
                })
        }
        catch (err) {
            res.status(500).send(err)
        }



    })

    router.post('/create', async (req, res) => {

        let parsedData = {};
        try {
            utils.uploadFileParamsPromise(req)
                .then((formData) => {
                    parsedData = formData
                    return utils.readDataFromDB(dirname + '/Db/user.json')
                })
                .then((userData) => {
                    let userToBeAdded = {}
                    userToBeAdded[parsedData.fields.email] = {
                        name: parsedData.fields.name,
                        age: parsedData.fields.age,
                        skill: parsedData.fields.skill
                    }

                    return new Promise((resolve) => {
                        userData.push(userToBeAdded)
                        resolve(userData)
                    })
                })
                .then((addedUserData) => {
                    return utils.writeDataToDB(dirname + '/Db/user.json', addedUserData)
                })
                .then(() => {
                    res.status(200).send({ message: 'user is added successfully' });
                })
                .catch((err) => {
                    res.status(400).send(err);
                })

        }
        catch (err) {
            res.status(500).send(err);
        }

    })

    router.post('/savedeckstate', (req, res) => {

        utils.readDataFromDB(dirname + '/Db/deckState.json')
            .then((deckData) => {

                if (deckData.length == 0) {
                    deckData.push(req.body);
                }
                else {
                    for (let i = 0; i <= deckData.length - 1; i++) {
                        if (deckData[i].user == req.body.user) {
                            //deckData[i][req.body.user] = req.body.deckData;
                            deckData.splice(i, 1);
                            deckData.push(req.body);
                            break;
                        }
                        if (i == deckData.length - 1) {
                            deckData.push(req.body);
                            //res.status(400).send('invalid user for deck save')
                            //deckData[deckData.length][req.body.email] = req.body.deckData;
                        }
                    }
                }

                return new Promise((resolve) => {
                    resolve(deckData)
                })
            })
            .then((deckData) => {
                return utils.writeDataToDB(dirname + '/Db/deckState.json', deckData)
            })
            .then(() => {
                res.status(200).send({ message: 'deck is added successfully' });
            })
            .catch((err) => {
                res.status(400).send(err.message)
            })

    })

    router.post('/getdeckstate', (req, res) => {

        utils.readDataFromDB(dirname + '/Db/deckState.json')
            .then((deckData) => {
                return new Promise((resolve) => {
                    for (let i = 0; i <= deckData.length - 1; i++) {
                        if (deckData[i].user == req.body.user) {
                            resolve(deckData[i])
                        }
                        if (i == deckData.length - 1) {
                            resolve({ message: 'No deck is found' })
                        }
                    }
                })
            })
            .then((readResultOfDeck) => {
                res.status(200).send(readResultOfDeck)
            })
            .catch((err) => {
                res.status(500).send(readResultOfDeck)
            })

    })

    return router;

}