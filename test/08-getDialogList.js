const io = require("socket.io-client");
const util = require("util");
var expect = require("chai").expect();
const assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var whoami = {};
var socket;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

//-------------------------------------------
// Der Test(args) (siehe DPT-openapi)
function getDialogListTest(publicKey) {
  //-------------------------------------------

  describe("request", function () {
    it("should send string", async function () {
      await socket.emit("api", {
        //------------------------------------
        method: "get", // siehe DTP-openapi
        path: "/dialog/list/", // siehe DTP-openapi
        data: {
          content: publicKey,
          //---------------------------------------
        },
      });
    });
    it("it should receive an anwer", function (done) {
      //-----------------------------------------------------------
      // Den hier folgenden Code benötige ich auch im putTopic.js
      // Per Copy und Paste rüberbringgen
      socket.on("api", async function (payload) {
        done();
        socket.disconnect();
        console.log("output: " + util.inspect(payload));
        await sleep(100);
        process.exit();
      });
      // Bis hier wird kopiert -------------------------------------
    });
  });
}

async function main() {
  describe("connect and login", function () {
    it("it will connect to the server", function (done) {
      socket = io.connect("ws://localhost:3100", {
        transports: ["websocket"],
        forceNew: true,
        reconnection: false,
      });
      done();
    });

    it("it will send the cookie to the server", (done) => {
      socket.on("connect", async () => {
        assert.equal(socket.connected, true);
        await socket.emit("login", {
          //----------------------------------------
          method: "post", // siehe DTP-openapi
          path: "/user/login/", // siehe DTP-openapi
          //----------------------------------------

          data: {
            publicKey: dptcookie,
          },
        });
        done();
      });
    });

    it("it will receive a login message", (done) => {
      socket.on("private", function (restObj) {
        try {
          assert.equal(restObj.data.message, "logged in");
        } catch (err) {
          console.log(err);
        }
        if (restObj.method == "post") {
          if (restObj.path == "/user/login/") {
            whoami.dptUUID = restObj.data.dptUUID;

            if (restObj.data.message == "logged in") {
              whoami.user = restObj.data.user;

              //------------------------------------------
              getDialogListTest("publicKey"); // aufruf der function (args siehe DPT-openapi)
              //-----------------------------------------
            }
            if (restObj.data.message == "user unknown") {
              whoami.user = {};
            }
          }
        }
        done();
      });
    });
  });
}
const fs = require("fs");
const dptcookie = fs.readFileSync("test/dptcookie.txt").toString();
// main ruft postNilsTestPath() wenn die verbindung
// zum server eingerichtet ist und die autifikation bestätigt ist
main();
