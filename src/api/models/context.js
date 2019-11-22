const mongoose = require("mongoose");
const User = require("./user").userModel;
const Opinion = require("./opinion").topicModel;
const Schema = mongoose.Schema;

const contextSchema = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	opinion: {
		type: Schema.Types.ObjectId,
		ref: "Opinion",
		required: true,
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

contextSchema.index({content: 'text'});
exports.contextModel = mongoose.model("Context", contextSchema);
