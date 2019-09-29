
const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Opinion = require("../models/opinion").opinionModel;
const User = require("../models/user").userModel;
const Topic = require("../models/topic").topicModel;
const Dialog = require("../models/dialog").dialogModel;
const util = require("util");
const logger = require("../../lib/logger");
const log = logger(config.logger);
const Lo_ = require('lodash');


const mongoose = require("mongoose");
const Schema = mongoose.Schema


module.exports.opinionPostAllowed = async (options, oid) => {
	if(options.body.topicId && oid) {
		var opinions = await Opinion.findOne({topic: mongoose.Types.ObjectId(options.body.topicId), user: oid._id});
		if(opinions == null) {
			return(true);
		}
	}
	return(false);
}

module.exports.getOpinionsByTopicId = async (options, userId) => {
	if(options.body.id) {
		try {
			var topic = await Topic.findOne({_id: options.body.id});
				//console.log(util.inspect(topic, {depth: 2}));

			var opinions = [];
			for(var i in topic.opinions) {
				var opinion = await Opinion.findOne({_id: topic.opinions[i]});
				if(opinion) {
					opinions.push(opinion);
				}
			}

			var dialogs = [];
			for(var i in opinions) {
				var dialog = await Dialog.findOne({opinion: opinions[i]._id});
				opinions[i]._doc.blocked = 0;
				opinions[i]._doc.topo = { leafs: [] };
				if(dialog) {

					console.log(topic.content);
					console.log(dialog.status);

					var topo = {
						dialogId: dialog._id,
						opinionId: opinions[i]._id,
						initiatorsOpinion: '',
						recipientsOpinion: '',
						dialogStatus: dialog.status,
						leafs: {
							positive: [],
							negative: [],
							neutral: [],
							unset: [],
					} };

					var opinionInitiator = Lo_.find(opinions, { user: dialog.initiator});
					var opinionRecipient = Lo_.find(opinions, { user: dialog.recipient});
				
					var crisisInitiator = Lo_.find(dialog.crisises, { initiator: dialog.initiator});
					var crisisRecipient = Lo_.find(dialog.crisises, { initiator: dialog.recipient});
				
					if(opinionInitiator)
						topo.initiatorsOpinion = opinionInitiator.content;
				
					if(opinionRecipient)
						topo.recipientsOpinion = opinionRecipient.content;

					if(crisisInitiator) {
						if(crisisInitiator.rating > 0) {
							topo.leafs.positive.push(opinionInitiator._id);
						} else if(crisisInitiator.rating == 0) {
							topo.leafs.neutral.push(opinionInitiator._id);
						} else if(crisisInitiator.rating < 0) {
							topo.leafs.negative.push(opinionInitiator._id);
						}
					} else {
						topo.leafs.unset.push(opinionInitiator._id.toString());
					}
					if(crisisRecipient) {
						if(crisisRecipient.rating > 0) {
							topo.leafs.positive.push(opinionRecipient._id);
						} else if(crisisRecipient.rating == 0) {
							topo.leafs.neutral.push(opinionRecipient._id);
						} else if(crisisRecipient.rating < 0) {
							topo.leafs.negative.push(opinionRecipient._id);
						}
					} else {
						topo.leafs.unset.push(opinionRecipient._id.toString());
					}


					console.log(util.inspect(topo));
					console.log('\n\n');

					opinions[i]._doc.blocked = 1;
					opinions[i]._doc.topo = topo;
				}
			}
			return({
				status: 200,
				data: opinions
			});
		} catch(error) {
			throw({
				status: 500,
				data: error.message
			});
		}
	} else {
		return({
			status: 400,
			data: "Opinion can't found"
		});
	}
};
			
			
			
			
module.exports.getOpinionsByTopicIdXXX = async (options, userId) => {
	if(options.body.id) {
		var opinions;
		try {
			opinions = await Opinion.find({ topic: options.body.id });
			var dialogs = [];
			for(var i=0; i < opinions.length; i++) {
				opinions[i]._doc.blocked = 0;
				opinions[i]._doc.topo = { leafs: [] };

				var dialogarr = await Dialog.find({ opinion: opinions[i]._id});

				for(var j in dialogarr) {
					if(dialogarr[j].recipient == userId || dialogarr[j].initiator == userId) {
						opinions[i]._doc.blocked = 1;
					}
					dialogs.push(dialogarr[j]);
				}
			}
			
			for(var i in opinions) {
				var topo = {
					dialogId: '',
					objectId: '',
					initiatorsOpinion: '',
					recipientsOpinion: '',
					dialogStatus: '',
					leafs: {
						positive: [],
						negative: [],
						neutral: [],
						unset: [],
					} };
			
				var dialog;
				
				dialogarr = Lo_.filter(dialogs, { initiator: opinions[i].user });
				if(!dialogarr) {
					dialogarr = Lo_.filter(dialogs, { recipient: opinions[i].user });
				}
				if(!dialogarr) {
					continue;
				}
				
				for(j in dialogarr) {
					var opinionInitiator = Lo_.find(opinions, { user: dialogarr[j].initiator});
					var opinionRecipient = Lo_.find(opinions, { user: dialogarr[j].recipient});
					
					
					var crisisInitiator = Lo_.find(dialogarr[j].crisises, { initiator: dialogarr[j].initiator});
					var crisisRecipient = Lo_.find(dialogarr[j].crisises, { initiator: dialogarr[j].recipient});
					
					topo.dialogId = dialogarr[j]._id.toString();
					topo.dialogStatus = dialogarr[j].status;
					topo.opinionId = opinionInitiator._id.toString();
					topo.initiatorsOpinion = opinionInitiator.content;
					topo.recipientsOpinion = opinionRecipient.content;
					
					if(crisisInitiator && 'rating' in crisisInitiator) {
						if(crisisInitiator.rating > 0) {
							topo.leafs.positive.push(opinionRecipient._id.toString());
						} else if (crisisInitiator.rating < 0) {
							topo.leafs.negative.push(opinionRecipient._id.toString());
						} else {
							topo.leafs.neutral.push(opinionRecipient._id.toString());
						}
					} else {
//						topo.leafs.unset.push(opinionRecipient._id.toString());
					}
	
					if(crisisRecipient && 'rating' in crisisRecipient) {
						if(crisisRecipient.rating > 0) {
							topo.leafs.positive.push(opinionInitiator._id.toString());
						} else if (crisisRecipient.rating < 0) {
							topo.leafs.negative.push(opinionInitiator._id.toString());
						} else {
							topo.leafs.neutral.push(opinionInitiator._id.toString());
						}
					} else {
//						topo.leafs.unset.push(opinionInitiator._id.toString());
					}
				}
				
				if(topo.leafs.negative.length > 0
				|| topo.leafs.neutral.length > 0
				|| topo.leafs.positive.length > 0) {
					opinions[i]._doc.topo = topo;
				}
			}
			
			return({
				status: 200,
				data: opinions
			});
		} catch(error) {
			throw({
				status: 500,
				data: error.message
			});
		}
	} else {
		return({
			status: 400,
			data: "Opinion can't found"
		});
	}
};


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getOpinions = async (options) => {
	var opinions;
	try {
		opinions = await Opinion.find([]);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}
	return({
		status: 200,
		data: opinions
	});
};

/**
 * @param {Object} options
 * @param {String} options.opinionId opinion that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPut = async (options) => {
	var result

	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Opinion text is to long",
		};
	}

	try {
		result = await Opinion.findByIdAndUpdate(
			options.opinionId,
			options.body
		);
//		result.content = options.body.content;
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return({
		status: 200,
		data: result,
	});
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPost = async options => {
	var result;

	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Opinion text is to long",
		};
	}	

	try {
		result = await Opinion.create(options.body);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return({
		status: 200,
		data: result,
	});
};
