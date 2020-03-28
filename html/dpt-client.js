// Digital Peace Talks - API
class DPT {
  constructor(socket) {
    this.socket = socket;
    return this;
  }

  // user

  getSocket() {
    return this.socket;
  }

  getSocketId() {
    return this.socket.id;
  }

  getMetadataUser(publicKey) {
    this.socket.emit("api", {
      method: "get",
      path: "/metadata/user/" + publicKey + "/",
      data: {
        publicKey: publicKey,
      },
    });
  }

  searchTopicsAndOpinions(searchString) {
    this.socket.emit("api", {
      method: "get",
      path: "/metadata/search/" + searchString + "/",
      data: {
        body: {
          searchString: searchString,
        },
      },
    });
  }

  userReclaim(phrase, publicKey) {
    this.socket.emit("api", {
      method: "put",
      path: "/user/reclaim/" + publicKey + "/",
      data: {
        body: {
          phraseGuess: phrase,
          publicKey: publicKey,
        },
      },
    });
  }

  userLogin(publicKey) {
    this.socket.emit("login", {
      method: "post",
      path: "/user/login/",
      data: {
        publicKey: publicKey,
      },
    });
  }

  userUpdate(publicKey, preferences) {
    this.socket.emit("api", {
      method: "put",
      path: "/user/update/" + publicKey + "/",
      data: {
        publicKey: publicKey,
        body: preferences,
      },
    });
  }

  userDelete(publicKey) {
    this.socket.emit("api", {
      method: "delete",
      path: "/users/" + publicKey + "/",
      data: {
        publicKey: publicKey,
      },
    });
  }

  // topic
  //TODO:should be renamed or documented, this gets all topics and not a single one
  getTopic() {
    this.socket.emit("api", {
      method: "get",
      path: "/topic/",
    });
  }

  postTopic(topic) {
    this.socket.emit("api", {
      method: "post",
      path: "/topic/",
      data: {
        content: topic,
      },
    });
  }

  putTopic(topic, topicId, publicKey) {
    this.socket.emit("api", {
      method: "put",
      path: "/topic/" + topicId + "/",
      data: {
        dptUUID: publicKey,
        topicId: topicId,
        body: {
          content: topic,
        },
      },
    });
  }

  // opinion

  getOpinion() {
    this.socket.emit("api", {
      method: "get",
      path: "/opinion/" + topicId + "/",
      data: {},
    });
  }

  getOpinionByTopic(topicId) {
    this.socket.emit("api", {
      method: "get",
      path: "/opinion/" + topicId + "/",
      data: {
        id: topicId,
      },
    });
  }

  opinionOpinionsExist(topicId) {
    this.socket.emit("api", {
      method: "get",
      path: "/opinion/opinionsExist/",
      data: {
        topicId: topicId,
      },
    });
  }

  postOpinion(topicId, newOpinion, newContext) {
    this.socket.emit("api", {
      method: "post",
      path: "/opinion/",
      data: {
        topic: topicId,
        content: newOpinion,
        context: newContext,
      },
    });
  }

  putOpinion(publicKey, opinionId, topicId, newOpinion, newContext) {
    this.socket.emit("api", {
      method: "put",
      path: "/opinion/" + opinionId + "/",
      data: {
        dptUUID: publicKey,
        opinionId: opinionId,
        topicId: topicId,
        body: {
          content: newOpinion,
          context: newContext,
        },
      },
    });
  }

  // dialog

  postDialog(proposition, publicKey, opinionId, topicId) {
    this.socket.emit("api", {
      method: "post",
      path: "/dialog/",
      data: {
        dptUUID: publicKey,
        body: {
          opinion: opinionId,
          topic: topicId,
          opinionProposition: proposition,
        },
      },
    });
  }

  getDialogList() {
    this.socket.emit("api", {
      method: "get",
      path: "/dialog/list/",
      data: {},
    });
  }

  getDialogListAll() {
    this.socket.emit("api", {
      method: "get",
      path: "/dialog/listAll/",
      data: {},
    });
  }

  getDialog(dialogId) {
    this.socket.emit("api", {
      method: "get",
      path: "/dialog/" + dialogId + "/",
      data: {
        body: {
          dialogId: dialogId,
        },
      },
    });
  }

  getDialogSet(dialogId) {
    this.socket.emit("api", {
      method: "get",
      path: "/dialogSet/" + dialogId + "/",
      data: {
        body: {
          dialogId: dialogId,
        },
      },
    });
  }

  putDialog(dialogId, topic, key, value) {
    var obj = {
      method: "put",
      path: "/dialog/" + dialogId + "/",
      data: {
        dialogId: dialogId,
        body: {
          topic: topic,
        },
      },
    };
    obj.data.body[key] = value;
    this.socket.emit("api", obj);
  }

  postMessage(message, publicKey, dialogId) {
    this.socket.emit("api", {
      method: "post",
      path: "/dialog/" + dialogId + "/message/",
      data: {
        publicKey: publicKey,
        message: message,
        dialogId: dialogId,
      },
    });
  }

  postCrisis(reason, rating, dialogId, messageId, publicKey) {
    this.socket.emit("api", {
      method: "post",
      path: "/dialog/" + dialogId + "/crisis/",
      data: {
        initiator: publicKey,
        reason: reason,
        rating: rating,
        dialogId: dialogId,
        causingMessage: messageId,
      },
    });
  }

  extensionRequest(dialogId, publicKey) {
    this.socket.emit("api", {
      method: "post",
      path: "/dialog/" + dialogId + "/extensionRequest/",
      data: {
        dialogId: dialogId,
        sender: publicKey,
      },
    });
  }
}
