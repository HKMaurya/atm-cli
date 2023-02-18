const mongoose = require('mongoose');
const User = mongoose.model('User');
const { toLowerCase, removeEmptySpace } = require("../utils/common");

const nameExist = async (name) => {
    try {
        name = toLowerCase(removeEmptySpace(name));
        let user = await User.findOne({ name })
        return user ? user : false
    } catch (err) {
        return false;
    }
};

const saveUser = async (name) => {
    try {
        name = toLowerCase(removeEmptySpace(name));
        const user = await User.create({ name, balance: 0, session: true });
        return user;
    } catch (err) {
        return false
    }
}

const checkActiveSession = async () => {
    try {
        const user = await User.findOne({ session: true });
        return user;
    } catch (err) {
        return false
    }
}

const updateSession = async (name, session) => {
    try {
        return await User.updateOne({ name }, { session });
    } catch (err) {
        return false
    }
}

const depositUserAmount = async (name, amt) => {
    try {
        return await User.updateOne({ name }, { $inc: { balance: amt } } );
    } catch (err) {
        return false
    }
}

const depositUserAmountWithOwn = async (name, data) => {
    try {
        let { depositAmt, oweTo, oweFrom } = data;
        return await User.updateOne({ name }, { $inc: { balance: depositAmt }, oweTo, oweFrom } );
    } catch (err) {
        return false
    }
}

module.exports = {
    nameExist,
    saveUser,
    checkActiveSession,
    updateSession,
    depositUserAmount,
    depositUserAmountWithOwn
}