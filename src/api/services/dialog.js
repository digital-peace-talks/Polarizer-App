const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const mongoose = require("mongoose");
const Dialog = require("../models/dialog").dialogModel;
const Opinion = require("../models/opinion").opinionModel;
const Topic = require("../models/topic").topicModel;
const Lo_ = require("lodash");
const util = require("util");


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createDialog = async (options) => {
	console.log(options);
	var result;
	if(options.opinionProposition.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Proposition text is to long",
		};
	}
	try {
		const opinion = await Opinion.findOne({"_id": mongoose.Types.ObjectId(options.opinion)});
		options.recipient = opinion.user;
		const initiatorOpinion = await Opinion.findOne({topic: mongoose.Types.ObjectId(options.topic), user: mongoose.Types.ObjectId(options.initiator)});
		options.initiatorOpinion = initiatorOpinion._id;
		result = await Dialog.create(options);
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	return {
		status: 200,
		data: result,
	};
};


async function findExtraDialog(firstDialog) {
	var opinion = await Opinion.findOne({_id: firstDialog.opinion});
	var opinions = await Opinion.find({topic: mongoose.mongo.ObjectId(opinion.topic)});

	for(var i in opinions) {
		var dialogs = await Dialog.find({opinion: opinions[i]._id, status: "CLOSED"});
		for(j in dialogs) {
			if(dialogs[j].initiator.toString() == firstDialog.recipient.toString()
			&& dialogs[j].recipient.toString() == firstDialog.initiator.toString()) {
				
				return(dialogs[j]);
			}
		}
	}
}

module.exports.getDialog = async (options, getSet) => {
	var result;
	var result2;
	try {
		
		console.log(util.inspect(options.body));
		var dialogId = mongoose.Types.ObjectId(options.body.dialogId);
		var now = new Date();
		now = now.toISOString();
		result = await Dialog.findOne({"_id": dialogId});
		if('user' in options) {
			if(result.initiator.id.toString('hex') == options.user.user.id) {
				await Dialog.findByIdAndUpdate(dialogId, {initiatorTimestamp: now});
			} else if(result.recipient.id.toString('hex') == options.user.user.id) {
				await Dialog.findByIdAndUpdate(dialogId, {recipientTimestamp: now});
			}
		}
		if(getSet) {
			result2 = await findExtraDialog(result);
			if(result2) {
				if(result.crisises[1].startDate.valueOf() < result2.crisises[1].startDate.valueOf()) {
					result = [ result, result2 ];
				} else {
					result = [ result2, result ];
				}
				if('user' in options) {
					if(result2.initiator.id.toString('hex') == options.user.user.id) {
						await Dialog.findByIdAndUpdate(dialogId, {initiatorTimestamp: now});
					} else if(result2.recipient.id.toString('hex') == options.user.user.id) {
						await Dialog.findByIdAndUpdate(dialogId, {recipientTimestamp: now});
					}
				}
			}
		}
		
		if(!Array.isArray(result)) {
			result = [ result ];
		}

	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	
	return( {
		status: 200,
		data: result
	});
}

module.exports.getDialogListAll = async (options) => {
	var result = [];
	try {
		var worker = [];
		worker = await Dialog.find({$or: [{recipient: option.userId}, {initiator: option.userId}]});
		for(var i = 0; i < worker.length; i++) {
			var collection = {};
			collection.dialog = worker[i].id;
			collection.opinionProposition = worker[i].opinionProposition;
			collection.recipientOpinion = worker[i].opinion.content;
			collection.status = worker[i].status;

			if(worker[i].recipient == options.userId) {
				collection.recipient = 'me';
			} else {
				collection.recipient = 'notme';
			}
			if(worker[i].initiator == options.userId) {
				collection.initiator = 'me';
			} else {
				collection.initiator = 'notme';
			}
			result.push(collection);
		}
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	
	return({
		status: 200,
		data: result,
	});
} 

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to return
 * @throws {Error}
 * @return {Promise}
 */ 
module.exports.getDialogList = async (options) => {
	var result = [];
	try {
		var worker = {};
		worker = await Dialog.find({"initiator": options.userId}).populate('opinion');
		for(var i = 0; i < worker.length; i++) {
			var collection = {};
			collection.dialog = worker[i].id;
			collection.opinionProposition = worker[i].opinionProposition;
			collection.recipientOpinion = worker[i].opinion.content;
			collection.status = worker[i].status;
			collection.initiatorTimestamp = worker[i].initiatorTimestamp;
			collection.recipientTimestamp = worker[i].recipientTimestamp;
			collection.unreadMessages = 0;
			var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
			collection.topic = worker2.content;
			var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
			if(opinion) {
				collection.initiatorOpinion = opinion.content;
				collection.initiator = 'me';

				for(var m in worker[i].messages) {
					if(worker[i].messages[m].timestamp > collection.initiatorTimestamp) {
						collection.unreadMessages++;
					}
				}

				result.push(collection);
			}
		}
	
		worker = await Dialog.find({"recipient": options.userId}).populate('opinion');
		for(var i = 0; i < worker.length; i++) {
			var collection = {};
			collection.dialog = worker[i].id;
			collection.opinionProposition = worker[i].opinionProposition;
			collection.recipientOpinion = worker[i].opinion.content;
			collection.status = worker[i].status;
			collection.initiatorTimestamp = worker[i].initiatorTimestamp;
			collection.recipientTimestamp = worker[i].recipientTimestamp;
			collection.unreadMessages = 0;
			var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
			collection.topic = worker2.content;
			var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
			if(opinion) {
				collection.initiatorOpinion = opinion.content;
				collection.initiator = 'notme';

				for(var m in worker[i].messages) {
					if(worker[i].messages[m].timestamp > collection.recipientTimestamp) {
						collection.unreadMessages++;
					}
				}

				result.push(collection);
			}
		}
		for(var i=0; i<result.length; i++) {
			if(result[i].status == 'ACTIVE') {
				result[i].status = 'C';
			} else if(result[i].status == 'PENDING') {
				result[i].status = 'A';
			} else if(result[i].status == 'CRISIS') {
				result[i].status = 'B';
			} else if(result[i].status == 'CLOSED') {
				result[i].status = 'D';
			}
		}
		result = Lo_.sortBy(result, ['status', 'messages.timestamp']);
		for(var i=0; i<result.length; i++) {
			if(result[i].status == 'C') {
				result[i].status = 'ACTIVE';
			} else if(result[i].status == 'A') {
				result[i].status = 'PENDING';
			} else if(result[i].status == 'B') {
				result[i].status = 'CRISIS';
			} else if(result[i].status == 'D') {
				result[i].status = 'CLOSED';
			}
		}
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
	
	return({
		status: 200,
		data: result,
	});
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateDialog = async (options) => {
	var result;

	try {
		result = await Dialog.findByIdAndUpdate(options.dialogId, options.body);
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}

	return {
		status: 200,
		data: result,
	};
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.postMessage = async (options) => {

	var dialog;
	
	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Text entry is to long.",
		};
	}

	try {

		dialog = await Dialog.findById(options.dialogId);
		
		if(dialog.messages.length+1 > config.api.maxMessages * dialog.extension) {
			throw {
				status: 500,
				data: "Message limit exceeded.",
			};
		}

		dialog.messages.push(options.body);
		dialog.save();

	} catch(error) {

		throw {
			status: 500,
			data: error.message||error.data,
		};

	}

	return {
		status: 200,
		data: dialog,
	};
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to post crisis to
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createCrisis = async (options) => {
	var dialog;

	try {
		if(options.body.causingMessage == 'none') {
			delete(options.body.causingMessage);
		}
		dialog = await Dialog.findById(options.dialogId);
		dialog.crisises.push(options.body);
		await dialog.save();
		if(dialog.crisises.length >= 2) {
			module.exports.updateDialog({
				dialogId: options.dialogId,
				body: { status: 'CLOSED' },
			});
		}
	} catch (error) {
		throw {
			status: 500,
			data: error.message,
		};
	}

	return {
		status: 200,
		data: dialog
	};
};



module.exports.extensionRequest = async (options) => {
	var dialog;
	try {
		dialog = await Dialog.findById(options.dialogId);
		dialog.extensionRequests.push( options.body );
		await dialog.save();
		if(dialog.extensionRequests.length >= 2) {
			dialog = module.exports.updateDialog({
				dialogId: options.dialogId,
				body: {
					extension: dialog.extension + 1,
					extensionRequests: [],
				},
			});
		}
		return({
			status: 200,
			data: dialog,
		});
	} catch (error) {
		throw({
			status: 500,
			data: error.message,
		});
	}
}