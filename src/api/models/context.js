const mongoose = require("mongoose");
const User = require("./user").userModel;
const Opinion = require("./opinion").topicModel;
const Schema = mongoose.Schema;

const opinionContextSchema = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	// parent can be a topic or a opinion.
	parent: {
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

opinionContextSchema.index({content: 'text'});
exports.contextModel = mongoose.model("Context", opinionContextSchema);
