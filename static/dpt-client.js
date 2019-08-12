class DPT {

	constructor(socket) {
		this.socket = socket;
		return(this);
	}

	// user

	userReclaim(phrase, publicKey) {
		this.socket.emit("api", {
			method: 'put',
			path: '/user/reclaim/'+publicKey+'/',
			data: {
				body: {
					phraseGuess: phrase,
					publicKey: publicKey,
				}
			}
		});
	}	

	userLogin(publicKey) {
		this.socket.emit("login", {
			method: 'post',
			path: '/user/login/',
			data: {
				publicKey: publicKey
			}
		});
	}
	
	// topic
	
	
	getTopic() {
		this.socket.emit("api", {
			method: 'get',
			path: '/topic/'
		});
	}
	
	postTopic(topic) {
		this.socket.emit("api", {
			method: 'post',
			path: '/topic/',
			data: {
				content: topic
			}
		});
	}
	
	putTopic(topic, topicId) {
		this.socket.emit("api", {
			method: 'put',
			path: '/topic/'+topicId+'/',
			data: {
				dptUUID: whoami.dptUUID,
				topicId: topicId,
				body: {
					content: topic
				}
			}
		});
	}
	
	// opinion
	
	getOpinionByTopic(topicId) {
		this.socket.emit("api", {
			method: "get",
			path: "/opinion/"+topicId+"/",
			data: {
				id: topicId
			}
		});
	}
	
	opinionPostAllowed(topicId) {
		this.socket.emit('api', {
			method: 'post',
			path: "/opinion/postAllowed/",
			data: {
				topicId: topicId
			}
		});
	}

	postOpinion(topicId, newOpinion) {
		this.socket.emit("api", {
			method: 'post',
			path: '/opinion/',
			data: {
				topic: topicId,
				content: newOpinion
			}
		});
	}
	
	putOpinion(publicKey, opinionId, topicId, newOpinion) {
		this.socket.emit("api", {
			method: 'put',
			path: '/opinion/'+opinionId+'/',
			data: {
				dptUUID: publicKey,
				opinionId: opinionId,
				topicId: topicId,
				body: {
					content: newOpinion
				}
			}
		});
	}
	
	// dialog
}