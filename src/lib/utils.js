/**
 * Function generates a nonce for users using crypto module
 *
 * @returns {string} Returns a random string of 40 characters
 */
const generateNonce = () => {
  return crypto.randomBytes(20).toString('hex');
}

module.export = generateNonce;