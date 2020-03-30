
const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const backEngine = require("../../lib/backengineOpinions");
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
				var opinion = await Opinion.findOne({_id: topic.opinions[i]}).populate('topic', {"content": 1});
				if(opinion) {
					opinions.push(opinion);
				}
			}

			var dialogs = [];
			var results = [];
			
			for(var i in opinions) {
				dialogs = await Dialog.find({opinion: opinions[i]._id});
				opinions[i]._doc.topos = [];
				opinions[i]._doc.blocked = 1;
				for(var j in dialogs) {
					var dialog = dialogs[j];
					if(dialog) {
	
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
							if(crisisInitiator.rating > 0.25) {
								topo.leafs.positive.push(opinionInitiator._id);
							} else if(crisisInitiator.rating < -0.25) {
								topo.leafs.negative.push(opinionInitiator._id);
							} else {
								topo.leafs.neutral.push(opinionInitiator._id);
							}
						} else {
							topo.leafs.unset.push(opinionInitiator._id);
						}
						if(crisisRecipient) {
							if(crisisRecipient.rating > 0.25) {
								topo.leafs.positive.push(opinionRecipient._id);
							} else if(crisisRecipient.rating < -0.25) {
								topo.leafs.negative.push(opinionRecipient._id);
							} else {
								topo.leafs.neutral.push(opinionRecipient._id);
							}
						} else {
							topo.leafs.unset.push(opinionRecipient._id);
						}

					}
					opinions[i]._doc.topos.push(topo);
				}
			}
			
			opinions = await backEngine.calculatePositions(opinions);
			
			return({
				status: 200,
				data: opinions,
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
		if(options && 'opinionId' in options) {
			opinions = await Opinion.find({_id: options.opinionId});
		} else {
			opinions = await Opinion.find([]);
		}
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
