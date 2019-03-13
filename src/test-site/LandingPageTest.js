"use strict";

const assert = require("assert");
const fs = require("fs");
const ServerBuilder = require("../main/ServerBuilder");
const {Builder, Browser, By} = require("selenium-webdriver");

describe("Landing page", function()
{
    [Browser.SAFARI].forEach((browser) => describe(`test in ${browser}`, function()
    {
        this.timeout(20000);
        let driver;
        let server;

        before(async function()
        {
            driver = new Builder().forBrowser(browser).build();
            driver.switchTo().window(driver.getWindowHandle());
            server = ServerBuilder.buildServer();
            await server.start("localhost", 8080);
        });

        after(async function()
        {
            await server.stop();
            driver.quit();
        });

        afterEach(async function()
        {
            const coverage = await driver.executeScript(() => JSON.stringify(window.__coverage__));
            fs.writeFileSync(`${__dirname}/../../target/coverage-temp/coverage-${Date.now()}.raw.json`, coverage);
        });

        it("should show landing page", async function()
        {
            await driver.get("http://localhost:8080/");
            assert.strictEqual(await driver.getTitle(), "Digital Peace Talks");
            await driver.findElement(By.css("html body"));
            await driver.sleep(1000);
        });
    }));
});