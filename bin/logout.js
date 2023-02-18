#!/usr/bin/env node
"use strict";
require('../utils/db');
require('../models');
const yargs = require("yargs");
const mongoose = require('mongoose');
const { updateSession, checkActiveSession } = require("../helpers/user");
const { capitalizeFirstLetter, removeEmptySpace } = require("../utils/common");

(async () => {
    const options = yargs.command('').argv;
    let activeUser = await checkActiveSession();
    if (activeUser) {
        await updateSession(activeUser.name, false);
        const greeting = `Goodbye, ${capitalizeFirstLetter(removeEmptySpace(activeUser.name))}!`;
        console.log(greeting);
        await mongoose.disconnect()
    } else {
        let msg = `Sorry! there is no active session.`
        console.log(msg);
        await mongoose.disconnect()
    }
})();