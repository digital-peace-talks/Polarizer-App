const express = require("express");
const util = require("util");
const Lo_ = require('lodash');
const mongoose = require("mongoose");
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var HTTP_PORT = 3101;

var connection;
UserSchema = require("../api/models/user");
TopicSchema = require("../api/models/topic");
OpinionSchema = require("../api/models/opinion");
DialogSchema = require("../api/models/dialog");

Opinion = OpinionSchema.opinionModel;
User = UserSchema.userModel;
Topic = TopicSchema.topicModel;
Dialog = DialogSchema.dialogModel;
	

async function deleteTopic(topicId) {

	console.log("topicId: "+topicId);
	var topic = await Topic.findOne({_id: topicId}, {_id: 1}).populate('opinions', {_id: 1});
	console.log("TOPIC: "+util.inspect(topic, {depth: 5}));

	for(var i in topic.opinions) {
		var dialogs = await Dialog.find({opinion: topic.opinions[i]._id}, {_id: 1});
		for(var j in dialogs) {
			console.log("DIALOGS - delete: "+util.inspect(dialogs[j], {depth: 5}));
			await Dialog.deleteOne({_id: dialogs[j]._id});
		}
		console.log("OPINIONS - delete: "+topic.opinions[i]._id);
		await Opinion.deleteOne({_id: topic.opinions[i]._id});
	}
	await Topic.deleteOne({_id: topicId});
}

async function deleteOpinion(opinionId) {
	console.log("delete opinion: "+opinionId);
	var opinion = await Opinion.findOne({_id: opinionId});
	var topicId = opinion.topic;
	var dialogs = await Dialog.find({opinion: opinionId}, {_id: 1});
	for(i in dialogs) {
		console.log("DIALOGS - delete: "+util.inspect(dialogs));
		await Dialog.deleteOne({_id: dialogs[i]._id});
	}
	await Opinion.deleteOne({_id: opinionId});
	return(listOpinions(topicId));
}

async function listTopics() {
	const topics = await Topic.find({});
	var ret = 'Admin tool<br><br><b>Topic list:</b><table>';
	for(var i in topics) {
		ret += `<tr>
			<td valign="top"><span class="listTopics" id='{"op": "deleteTopic", "topicId": "${topics[i]._id}"}'> DEL </span></td>
			<td valign="top"><span class="listTopics" id='{"op": "listOpinions", "topicId": "${topics[i]._id}"}'>${topics[i].content}</span></td>
			</tr>`;
	}
	ret += '</table>';
	console.log(ret);
	return(ret);
}

async function listOpinions(topicId) {
	const opinions = await Opinion.find({topic: topicId});
	var ret = `<span class="listOpinions" id='{"op": "listTopics"}'>BACK</span><br><br>
			<b>Opinion list:</b><table>`
	for(var i in opinions) {
		ret += `<tr>
			<td valign="top"><span class="listOpinions" id='{"op": "deleteOpinion", "opinionId": "${opinions[i].id}"}'> DEL </span></td>
			<td valign="top"><span class="listOpinions" id='{"op": "listDialogs", "opinionId": "${opinions[i].id}"}'>${opinions[i].content}</span></td>
			</tr>`;
	}
	ret += '</table>';
	console.log(ret);
	return(ret);
}



app.use(function(req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests
	// sent to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});


app.listen(HTTP_PORT, async () => {
	connection = await mongoose.connect("mongodb://localhost:27017/dpt-dev", { useUnifiedTopology: true , useNewUrlParser: true, });
	console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});


app.post("/deleteTopic", async (req, res) => {
	console.log(util.inspect(req.body));
	try {
		if ('topicId' in req.body) {
			await deleteTopic(req.body.topicId);
		}
	} catch(err) {
		res.json({ok:false});
	}
	res.json({ok:true});
});

app.post("/deleteOpinion", async (req, res) => {
	var ret = ''
	try {
		if('opinionId' in req.body) {
			ret = await deleteOpinion(req.body.opinionId);
			res.json({ok: true, ret: ret});
		}
	} catch(err) {
		res.json({ok: false, error: err});
	}
});

app.post("/listTopics", async (req, res) => {
	var ret = '';
	try {
		ret = await listTopics();
		console.log(ret);
		res.json({ok: true, ret: ret});
	} catch(err) {
		res.json({ok: false, error: err});
	}
});


app.post("/listOpinions", async (req, res) => {
	var ret = '';
	try {
		if('topicId' in req.body) {
			console.log(util.inspect(req.body.topicId));
			ret = await listOpinions(req.body.topicId);
			console.log(ret);
			res.json({ok: true, ret: ret});
		}
	} catch(err) {
		res.json({ok: false, error: err});
	}
});

app.get("/", async (req, res) => {

	var lt = await listTopics();

	res.send(`<!DOCTYPE html>
	<html>
	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<head>
		<title>DPT Admin</title>
	<!-- <link href="/static/dpt_admin.css" rel="stylesheet" /> -->
	</head>
	<body>
	<div id="content">
	${lt}
	</div>
	</body>
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script type="text/javascript">
		function handleSpanClick(args) {
			if("op" in args) {
				if(args.op == "listTopics") {
					jQuery.ajax({ 
						url: '/listTopics',
						type: 'POST',
						cache: false, 
						data: JSON.stringify({}),
						success: function(data) {
							jQuery("div#content").html(data.ret);
							console.log(data);
						},
						error: function(jqXHR, status, err) {
							alert('text status '+status+', err '+err);
						},
						dataType: 'json',
						contentType: "application/json",
					});
				} else if(args.op == "deleteTopic" && 'topicId' in args) {
					jQuery.ajax({ 
						url: '/deleteTopic',
						type: 'POST',
						cache: false, 
						data: JSON.stringify({topicId: args.topicId}),
						success: function(data) {
							document.location = "/";
						},
						error: function(jqXHR, status, err) {
							alert('text status '+status+', err '+err);
						},
						dataType: 'json',
						contentType: "application/json",
					});
				} else if(args.op == "listOpinions" && 'topicId' in args) {
					jQuery.ajax({ 
						url: '/listOpinions',
						type: 'POST',
						cache: false, 
						data: JSON.stringify({topicId: args.topicId}),
						success: function(data) {
							jQuery("div#content").html(data.ret);
							console.log(data);
						},
						error: function(jqXHR, status, err) {
							alert('text status '+status+', err '+err);
						},
						dataType: 'json',
						contentType: "application/json",
					});
				} else if(args.op == "deleteOpinion" && 'opinionId' in args) {
					jQuery.ajax({ 
						url: '/deleteOpinion',
						type: 'POST',
						cache: false, 
						data: JSON.stringify({opinionId: args.opinionId}),
						success: function(data) {
							jQuery("div#content").html(data.ret);
							console.log(data);
						},
						error: function(jqXHR, status, err) {
							alert('text status '+status+', err '+err);
						},
						dataType: 'json',
						contentType: "application/json",
					});
				}
			}
		}

		document.addEventListener("DOMContentLoaded", function(event) {
			jQuery(document).on("click", "span.listTopics", (event) => {
				const args = JSON.parse(event.target.id);
				handleSpanClick(args);
			});
			jQuery(document).on("click", "span.listOpinions", (event) => {
				const args = JSON.parse(event.target.id);
				handleSpanClick(args);
			});
		});
	</script>
	</html>
	`);
	res.status(200);
	console.log("Serve user at " + req.headers.host);
});

app.use('/static', express.static('/opt/DPT-server/static'))

app.use(function(req, res) {
	res.status(404);
});