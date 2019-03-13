"use strict";

const http = require("http");

/**
 * HTTP server.
 */
class Server
{
    /**
     * Creates a new instance of this class.
     *
     * @param {Router} router the endpoint router.
     */
    constructor(router)
    {
        this.router = router;
        this.server = null;
    }

    /**
     * Starts the server.
     *
     * @param {String} host the server host name or IP address.
     * @param {Number} port the server port number.
     * @return {Promise} the awaitable promise.
     */
    start(host, port)
    {
        return new Promise((resolve, reject) =>
        {
            if(this.server === null)
            {
                const server = http.createServer();
                server.on("clientError", (error, socket) => socket.end("HTTP/1.1 400 Bad Request\r\n\r\n"));
                server.on("request", Server.prototype.serve.bind(this));
                server.once("listening", resolve);
                server.once("error", reject);
                server.listen(port, host);
                this.server = server;
            }
            else
            {
                reject(new Error("already started"));
            }
        });
    }

    /**
     * Serves a HTTP request.
     *
     * @param {Object} req the HTTP request.
     * @param {Object} res the HTTP response.
     */
    serve(req, res)
    {
        try
        {
            this.router.serve(req, res);
        }
        catch(e)
        {
            process.stderr.write(`Error serving ${req.method.toUpperCase()} ${req.url}\n${e.stack}\n`);
            res.writeHead(500, "Internal Server Error");
            res.end();
        }
    }

    /**
     * Stops the server.
     *
     * @return {Promise} the awaitable promise.
     */
    stop()
    {
        return new Promise((resolve, reject) =>
        {
            if(this.server === null)
            {
                reject(new Error("not started yet"));
            }
            else
            {
                this.server.close((err) => err ? reject(err) : resolve());
                this.server = null;
            }
        });
    }
}

module.exports = Server;