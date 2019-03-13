"use strict";

/**
 * Send chat message endpoint.
 */
class SendEndpoint
{
    /**
     * Creates a new instance of this class.
     *
     * @param {Object} dao the data access object.
     */
    constructor(dao)
    {
        this.dao = dao;
    }

    /**
     * Serves a file.
     *
     * @param {Object} req the HTTP request.
     * @param {Object} res the HTTP response.
     */
    serve(req, res)
    {
        const {channel, message, sender} = req.body;
        this.dao.appendChatMessage(channel, sender, message);
        res.writeHead(200, "OK");
        res.end();
    }
}

module.exports = SendEndpoint;