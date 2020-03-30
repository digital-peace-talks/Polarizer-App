const express = require("express");
const dialog = require("../services/dialog");

const router = new express.Router();

/**
 * Creates a dialog
 */
router.post("/", async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await dialog.createDialog(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Gets a specific dialog by its ID
 */
router.get("/:dialogId/", async (req, res, next) => {
  const options = {
    dialogId: req.params["dialogId"],
  };

  try {
    const result = await dialog.getDialog(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Updates a specific dialog by its ID
 */
router.put("/:dialogId/", async (req, res, next) => {
  const options = {
    body: req.body,
    dialogId: req.params["dialogId"],
  };

  try {
    const result = await dialog.updateDialog(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Posts a message to a dialog
 */
router.post("/:dialogId/message/", async (req, res, next) => {
  const options = {
    body: req.body,
    dialogId: req.params["dialogId"],
  };

  try {
    const result = await dialog.postMessage(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

/**
 * Posts a crisis to a dialog
 */
router.post("/:dialogId/crisis/", async (req, res, next) => {
  const options = {
    body: req.body,
    dialogId: req.params["dialogId"],
  };

  try {
    const result = await dialog.createCrisis(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

module.exports = router;
