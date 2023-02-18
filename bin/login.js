#!/usr/bin/env node
"use strict";
require('../utils/db');
require('../models');
const yargs = require("yargs");
const Q = require("q");
const mongoose = require('mongoose');
const { capitalizeFirstLetter, removeEmptySpace, toLowerCase } = require("../utils/common");
const { nameExist, saveUser, checkActiveSession, updateSession } = require("../helpers/user");

(async () => {
    const options = yargs.command('<name>').argv;
    const userExist = await Q.all([checkActiveSession(), nameExist(options._[0])]);
    if (userExist && userExist[0]) {
        let finalAmt = userExist[1].balance > 0 ? userExist[1].balance : 0;
        let oweMsg = userExist[1].oweTo && userExist[1].oweTo.name && userExist[1].oweTo.balance > 0 ? `Owed $${userExist[1].oweTo.balance} to ${userExist[1].oweTo.name}` : userExist[1].oweFrom && userExist[1].oweFrom.name && userExist[1].oweFrom.balance > 0 ? `Owed $${userExist[1].oweFrom.balance} from ${userExist[1].oweFrom.name}` : '';
        if (userExist[0].name == toLowerCase(removeEmptySpace(options._[0]))) {
            const greeting = oweMsg ? `Hello, ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}!
Your balance is $${finalAmt}
${oweMsg}` : `Hello, ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}!
Your balance is $${finalAmt}`;
            console.log(greeting);
            await updateSession(userExist[1].name, true);
            await mongoose.disconnect();
        } else {
            let msg = `Sorry! there is already active session.`
            console.log(msg);
            await mongoose.disconnect()
        }
    } else {
        if (userExist[1]) {
            let finalAmt = userExist[1].balance > 0 ? userExist[1].balance : 0;
            let oweMsg = userExist[1].oweTo && userExist[1].oweTo.name && userExist[1].oweTo.balance > 0 ? `Owed $${userExist[1].oweTo.balance} to ${userExist[1].oweTo.name}` : userExist[1].oweFrom && userExist[1].oweFrom.name && userExist[1].oweFrom.balance > 0 ? `Owed $${userExist[1].oweFrom.balance} from ${userExist[1].oweFrom.name}` : '';
            const greeting = oweMsg ? `Hello, ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}!
Your balance is $${finalAmt}
${oweMsg}` : `Hello, ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}!
Your balance is $${finalAmt}`;
            console.log(greeting);
            await updateSession(userExist[1].name, true);
            await mongoose.disconnect();
        } else {
            await saveUser(options._[0])
            const greeting = `Hello, ${capitalizeFirstLetter(removeEmptySpace(options._[0]))}!
Your balance is $0`;
            console.log(greeting);
            await mongoose.disconnect()
        }
    }
})();