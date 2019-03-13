"use strict";

const assert = require("assert");
const http = require("http");
const Server = require("../../main/server/Server");

describe("Server", function()
{
    const fetch = async(url) => new Promise((resolve, reject) =>
    {
        const req = http.get(url);
        req.on("error", reject);
        req.on("response", (res) =>
        {
            const chunks = [];
            res.on("data", (chunk) => chunks.push(chunk));
            res.on("end", () => resolve([res.statusCode, Buffer.concat(chunks)]));
        });
    });

    describe("start and stop", function()
    {
        it("should start and stop", async function()
        {
            const app = new Server();
            await app.start("127.0.0.1", 8080);
            await app.stop();
        });
    });

    describe("start", function()
    {
        it("should fail to start if already started", async function()
        {
            const app = new Server();
            await app.start("127.0.0.1", 8080);
            assert.rejects(app.start("127.0.0.1", 8080));
            await app.stop();
        });
    });

    describe("stop", function()
    {
        it("should fail to stop if not yet started", async function()
        {
            const app = new Server();
            assert.rejects(app.stop());
        });
    });

    describe("serve static files", function()
    {
        const router = {serve: (req, res) => res.end("<!DOCTYPE html>")};
        const app = new Server(router);

        before(async function()
        {
            await app.start("localhost", 8080);
        });

        after(async function()
        {
            await app.stop();
        });

        it("should serve index.html", async function()
        {
            const [status, body] = await fetch("http://127.0.0.1:8080/");
            assert.strictEqual(status, 200);
            assert.strictEqual(body.toString().substr(0, 15), "<!DOCTYPE html>");
        });
    });
});