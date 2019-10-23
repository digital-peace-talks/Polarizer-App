const User = require("./user").userModel;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const extensionRequestSchema = mongoose.Schema({
	timestamp: {type: Date, default: Date.now},
	sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
	
const messageSchema = mongoose.Schema({
	timestamp: {type: Date, default: Date.now},
	sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
	content: String,
});

const crisisSchema = mongoose.Schema({
	startDate: { type: Date, required: true, default: Date.now },
	expirationDate: { type: Date, default: () => { return Date.now() + 86400000 * 5 }, required: true },
	initiator: { type: Schema.Types.ObjectId, ref: "User", required: true },
	reason: { type: String, required: true },
	rating: { type: Number, required: true, default: 0 },
	causingMessage: { type: Schema.Types.ObjectId, ref: "Dialog.messages" },
});

const dialogSchema = mongoose.Schema({
	opinion: {
		type: Schema.Types.ObjectId,
		ref: "Opinion",
		required: true,
	},

	status: {
		type: String,
		enum: ["PENDING", "ACTIVE", "CRISIS", "CLOSED"],
		default: "PENDING",
	},

	extension: {
		type: Number,
		default: 1,
		required: true,
	},
	
	extensionRequests: [extensionRequestSchema],
	
	startDate: {
		type: Date,
		required: true,
		default: Date.now,
	},

	opinionProposition: String,

	initiator: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	recipient: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	messages: [messageSchema],
	crisises: [crisisSchema],
	//	messages: [
	//		{
	//			_id: { type: Schema.Types.ObjectId },
	//			timestamp: Date,
	//			sender: { type: Schema.Types.ObjectId, ref: "User" },
	//			content: String,
	//		},
	//	],
	//	crisises: [
	//		{
	//			startDate: Date,
	//			expirationDate: Date,
	//			initiator: { type: Schema.Types.ObjectId, ref: "User" },
	//			reason: String,
	//			causingMessage: { type: Schema.Types.ObjectId, ref: "Dialog.messages" },
	//		},
	//	],
});

dialogSchema.post("save", async doc => {
	await User.findByIdAndUpdate(doc.initiator, { $addToSet: { dialogs: doc } });
	await User.findByIdAndUpdate(doc.recipient, { $addToSet: { dialogs: doc } });
	// initiator.save();
	// const recipient = await User.findById(doc.recipient);
	// recipient.dialogs.push(doc);
	// recipient.save();
});

dialogSchema.post("remove", async doc => {
	const user = await User.findById(doc.user);
	user.dialogs.pull(doc);
	user.save();
});

exports.dialogModel = mongoose.model("Dialog", dialogSchema);
