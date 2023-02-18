#!/usr/bin/env node
"use strict";
require('../utils/db');
require('../models');
const yargs = require("yargs");
const Q = require("q");
const mongoose = require('mongoose');
const { depositUserAmountWithOwn, checkActiveSession, depositUserAmount, nameExist } = require("../helpers/user");
const { capitalizeFirstLetter, checkValidAmount } = require("../utils/common");

(async () => {
    const options = yargs.command('<amount>').argv;
    let activeUser = await checkActiveSession();
    if (activeUser) {
        let depositAmt = checkValidAmount(options._[0]);
        if (depositAmt == 'string') {
            let greeting = `Please provide a valid input`;
            console.log(greeting);
            await mongoose.disconnect()
        } else {
            if (depositAmt == 'validAmt') {
                let greeting = `Please input a valid amount`;
                console.log(greeting);
                await mongoose.disconnect()
            } else {
                if (activeUser.oweTo && activeUser.oweTo.name && activeUser.oweTo.balance > 0) {
                    if (activeUser.oweTo.balance >= depositAmt) {
                        let owedToObj = {
                            depositAmt: 0,
                            oweTo: {
                                name: activeUser.oweTo.name,
                                balance: activeUser.oweTo.balance - depositAmt
                            },
                            oweFrom: {
                                name: '',
                                balance: 0
                            }
                        }
                        let owedFromObj = {
                            depositAmt: 0,
                            oweFrom: {
                                name: activeUser.name,
                                balance: activeUser.oweTo.balance - depositAmt
                            },
                            oweTo: {
                                name: '',
                                balance: 0
                            }
                        }
                        await Q.all([depositUserAmountWithOwn(activeUser.oweTo.name, owedFromObj), depositUserAmountWithOwn(activeUser.name, owedToObj)]);
                        let msg = activeUser.oweTo.balance == depositAmt ? `Transferred $${depositAmt} to ${capitalizeFirstLetter(activeUser.oweTo.name)}
your balance is $0` : `Transferred $${depositAmt} to ${capitalizeFirstLetter(activeUser.oweTo.name)}
your balance is $0
Owed $${activeUser.oweTo.balance - depositAmt} to ${capitalizeFirstLetter(activeUser.oweTo.name)}`;
                        console.log(msg);
                        await mongoose.disconnect()
                    } else {
                        let owedToObj = {
                            depositAmt: depositAmt - activeUser.oweTo.balance,
                            oweTo: {
                                name: '',
                                balance: 0
                            },
                            oweFrom: {
                                name: '',
                                balance: 0
                            }
                        }
                        let owedFromObj = {
                            depositAmt: depositAmt - activeUser.oweTo.balance,
                            oweFrom: {
                                name: '',
                                balance: 0
                            },
                            oweTo: {
                                name: '',
                                balance: 0
                            }
                        }
                        await Q.all([depositUserAmountWithOwn(activeUser.oweTo.name, owedFromObj), depositUserAmountWithOwn(activeUser.name, owedToObj)]);
                        let msg = `Transferred $${activeUser.oweTo.balance} to ${capitalizeFirstLetter(activeUser.oweTo.name)}
your balance is $${depositAmt - activeUser.oweTo.balance}`;
                        console.log(msg);
                        await mongoose.disconnect()
                    }
                } else {
                    await depositUserAmount(activeUser.name, depositAmt);
                    let usr = await nameExist(activeUser.name)
                    let msg = `Your balance is $${usr.balance}`;
                    console.log(msg);
                    await mongoose.disconnect()
                }
            }
        }
    } else {
        let msg = `Sorry! there is no active session.`
        console.log(msg);
        await mongoose.disconnect()
    }
})();