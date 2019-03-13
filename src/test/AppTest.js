"use strict";

const assert = require("assert");
const child_process = require("child_process");
const http = require("http");

describe("App", function()
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

    describe("start and serve", function()
    {
        let app;
        let stderr = "";
        let stdout = "";

        before(function(done)
        {
            const timeout = setTimeout(done, 5000);
            app = child_process.spawn("node", "src/main/App.js 127.0.0.1 8080".split(" "));
            app.stderr.on("data", (data) => void (stderr += data));
            app.stdout.on("data", (data) => void (stdout += data));
            app.stdout.once("data", () =>
            {
                clearTimeout(timeout);
                done();
            });
        });

        after(function(done)
        {
            app.on("close", (code) =>
            {
                assert.strictEqual(code, 0);
                assert.strictEqual(stderr, "");
                assert.strictEqual(stdout, "Server listening at 127.0.0.1:8080\nServer stopped\n");
                done();
            });
            app.kill("SIGINT");
        });

        it("should serve index file", async function()
        {
            const [status, body] = await fetch("http://127.0.0.1:8080/");
            assert.strictEqual(status, 200);
            assert.strictEqual(body.toString().substr(0, 15), "<!DOCTYPE html>");
        });
    });

    describe("fail on missing arguments", function()
    {
        it("should quit", function(done)
        {
            const app = child_process.spawn("node", ["src/main/App.js"]);
            let stderr = "";
            let stdout = "";
            app.stderr.on("data", (data) => void (stderr += data));
            app.stdout.on("data", (data) => void (stdout += data));
            app.on("close", (code) =>
            {
                assert.strictEqual(code, 1);
                assert.strictEqual(stderr, "");
                assert.strictEqual(stdout, "Usage: node App.js host port\n");
                done();
            });
        });
    });
});