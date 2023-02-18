#!/usr/bin/env node
"use strict";
require('../utils/db');
require('../models');
const yargs = require("yargs");
const Q = require("q");
const mongoose = require('mongoose');
const { checkActiveSession, depositUserAmount, nameExist, depositUserAmountWithOwn } = require("../helpers/user");
const { capitalizeFirstLetter, removeEmptySpace, checkValidAmount, toLowerCase } = require("../utils/common");

(async () => {
    const options = yargs.command('<target><amount>').argv;
    const userExist = await Q.all([checkActiveSession(), nameExist(options._[0])]);
    if (userExist[0]) {
        let depositAmt = checkValidAmount(options._[1]);
        if (depositAmt == 'string') {
            let greeting = `Please provide a valid input`;
            console.log(greeting);
            await mongoose.disconnect()
        } else if (depositAmt == 'validAmt') {
            let greeting = `Please input a valid amount`;
            console.log(greeting);
            await mongoose.disconnect()
        } else {
            if (userExist[0].oweFrom && toLowerCase(removeEmptySpace(userExist[0].oweFrom.name)) == toLowerCase(removeEmptySpace(options._[0])) && userExist[0].oweFrom.balance > 0) {
                if (userExist[0].oweFrom.balance >= depositAmt) {
                    let owedToObj = {
                        depositAmt: 0,
                        oweTo: {
                            name: userExist[0].name,
                            balance: userExist[0].oweFrom.balance - depositAmt
                        },
                        oweFrom: {
                            name: '',
                            balance: 0
                        }
                    }
                    let owedFromObj = {
                        depositAmt: 0,
                        oweFrom: {
                            name: toLowerCase(removeEmptySpace(options._[0])),
                            balance: userExist[0].oweFrom.balance - depositAmt
                        },
                        oweTo: {
                            name: '',
                            balance: 0
                        }
                    }
                    await Q.all([depositUserAmountWithOwn(userExist[0].name, owedFromObj), depositUserAmountWithOwn(toLowerCase(removeEmptySpace(options._[0])), owedToObj)]);
                    let msg = userExist[0].oweFrom.balance == depositAmt ? `Your balance is $${userExist[0].balance}` : `Your balance is $${userExist[0].balance}
Owed $${userExist[0].oweFrom.balance - depositAmt} to ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}`;
                    console.log(msg);
                    await mongoose.disconnect()
                } else if (userExist[0].balance > 0) {
                    let newAmt = depositAmt - userExist[0].oweFrom.balance;
                    if (userExist[0].balance > newAmt) {
                        let owedToObj = {
                            depositAmt: depositAmt - userExist[0].oweFrom.balance,
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
                            depositAmt: -(depositAmt - userExist[0].oweFrom.balance),
                            oweFrom: {
                                name: '',
                                balance: 0
                            },
                            oweTo: {
                                name: '',
                                balance: 0
                            }
                        }
                        await Q.all([depositUserAmountWithOwn(userExist[0].name, owedFromObj), depositUserAmountWithOwn(toLowerCase(removeEmptySpace(options._[0])), owedToObj)]);
                        let msg = `Transferred $${newAmt} to ${capitalizeFirstLetter(options._[0])}
your balance is $${userExist[0].balance - newAmt}`;
                        console.log(msg);
                        await mongoose.disconnect()
                    } else {
                        let newBalance = newAmt - userExist[0].balance;
                        let owedToObj = {
                            depositAmt: -newAmt,
                            oweTo: {
                                name: toLowerCase(removeEmptySpace(userExist[0].name)),
                                balance: newBalance
                            },
                            oweFrom: {
                                name: '',
                                balance: 0
                            }
                        }
                        let owedFromObj = {
                            depositAmt,
                            oweFrom: {
                                name: toLowerCase(removeEmptySpace(options._[0])),
                                balance: newBalance
                            },
                            oweTo: {
                                name: '',
                                balance: 0
                            }
                        }
                        await Q.all([depositUserAmountWithOwn(toLowerCase(removeEmptySpace(options._[0])), owedFromObj), depositUserAmountWithOwn(userExist[0].name, owedToObj)]);
                        let msg = `Transferred $${depositAmt} to ${capitalizeFirstLetter(options._[0])}
your balance is $0
Owed $${newBalance} to ${capitalizeFirstLetter(options._[0])}`;
                        console.log(msg);
                        await mongoose.disconnect()
                    }
                } else {
                    let msg = `Sorry! you don't have sufficient balance.`
                    console.log(msg);
                    await mongoose.disconnect()
                }
            } else {
                if (userExist[0].balance > 0) {
                    if (userExist[1]) {
                        if (userExist[0].balance >= depositAmt) {
                            await Q.all([depositUserAmount(userExist[1].name, depositAmt), depositUserAmount(userExist[0].name, -depositAmt)]);
                            let usr = await nameExist(userExist[0].name);
                            let finalAmt = usr.balance > 0 ? usr.balance : 0;
                            let msg = `Transferred $${depositAmt} to ${capitalizeFirstLetter(userExist[1].name)}
your balance is $${finalAmt}`;
                            console.log(msg);
                            await mongoose.disconnect()
                        } else {
                            let newBalance = depositAmt - userExist[0].balance;
                            let owedToObj = {
                                depositAmt: -userExist[0].balance,
                                oweTo: {
                                    name: userExist[1].name,
                                    balance: newBalance
                                },
                                oweFrom: {
                                    name: '',
                                    balance: 0
                                }
                            }
                            let owedFromObj = {
                                depositAmt : userExist[0].balance,
                                oweFrom: {
                                    name: userExist[0].name,
                                    balance: newBalance
                                },
                                oweTo: {
                                    name: '',
                                    balance: 0
                                }
                            }
                            await Q.all([depositUserAmountWithOwn(userExist[1].name, owedFromObj), depositUserAmountWithOwn(userExist[0].name, owedToObj)]);
                            let msg = `Transferred $${userExist[0].balance} to ${capitalizeFirstLetter(userExist[1].name)}
your balance is $0
Owed $${newBalance} to ${userExist[1].name}`;
                            console.log(msg);
                            await mongoose.disconnect()
                        }
                    } else {
                        let msg = `Sorry! target user does not exist in our platform.`
                        console.log(msg);
                        await mongoose.disconnect()
                    }
                } else {
                    let msg = `Sorry! you don't have sufficient balance.`
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