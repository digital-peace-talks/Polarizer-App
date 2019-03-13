"use strict";

const FileEndpoint = require("./server/FileEndpoint");
const Router = require("./server/Router");
const Server = require("./server/Server");
const SignInEndpoint = require("./api/auth/SignInEndpoint");
const SignUpEndpoint = require("./api/auth/SignUpEndpoint");

/**
 * Server builder.
 */
class ServerBuilder
{
    /**
     * Builds a new server.
     *
     * @return {Server} the newly built server instance.
     */
    static buildServer()
    {
        const router = new Router();
        router.addRoute("GET", /^.*$/, new FileEndpoint());
        router.addRoute("POST", "/signin/", new SignInEndpoint());
        router.addRoute("POST", "/signup/", new SignUpEndpoint());
        const server = new Server(router);
        return server;
    }
}

module.exports = ServerBuilder;