const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');
const onlineTimesSchema = mongoose.Schema({
	login: {type: Date, default: Date.now},
	logout: {type: Date, default: Date.now},
});

const preferencesSchema = mongoose.Schema({
	colorScheme: { type: Number },
	htmlScheme: {type: Number },
	stealthMode: {type: Boolean, default: true },
	guidedTour: {type: Boolean, default: true },
});

/**
 * Mongoose Schema for user data.
 * @type {*}
 *
 *
 */
const userSchema = mongoose.Schema({
	// Cookie for storing session
	publicKey: { type: String, unique: true, required: true },

	// Login phrase for BIP-39 style authentication
	phrase: { type: String, unique: true},

	// Public address for ETH wallet utilizing Metamask
	publicAddress: {type: String, unique: true},

	// Nonce for Metamask/web3 wallet login
	nonce: {type: String, unique: true},

	// humanID
	humanID: {type: String, unique: true},

	// Defines type of login chosen for user
	authType: {type: String},

	topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
	opinions: [{ type: Schema.Types.ObjectId, ref: "Opinion" }],
	dialogs: [{ type: Schema.Types.ObjectId, ref: "Dialog" }],
	signupTime: { type: Date, required: true },
	onlineTimes: [ onlineTimesSchema ],
	preferences: preferencesSchema,
});

exports.userModel = mongoose.model("User", userSchema);
