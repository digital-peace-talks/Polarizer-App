var fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
module.exports = async () => {
	try {
		var buf = await readFile('./dict/adjectives.txt');
		var adjectives = buf.toString().split("\n");
		buf = await readFile('./dict/adverbs.txt');
		var adverbs = buf.toString().split("\n");
		buf = await readFile('./dict/nouns.txt');
		var nouns = buf.toString().split("\n");
		buf = await readFile('./dict/verbs.txt');
		var verbs = buf.toString().split("\n");
		/*
		buf = await readFile('./dict/comparatives.txt');
		var comparatives = buf.toString().split("\n");
		buf = await readFile('./dict/conjunctions.txt');
		var conjunctions = buf.toString().split("\n");
		buf = await readFile('./dict/determiners.txt');
		var determiners = buf.toString().split("\n");
		buf = await readFile('./dict/interjections.txt');
		var interjections = buf.toString().split("\n");
		buf = await readFile('./dict/prepositions.txt');
		var prepositions = buf.toString().split("\n");
		*/
	
		var adjective = adjectives[Math.floor(Math.random() * (adjectives.length-1))];
		var adverb = adverbs[Math.floor(Math.random() * (adverbs.length-1))];
		var noun = nouns[Math.floor(Math.random() * (nouns.length-1))];
		var verb = verbs[Math.floor(Math.random() * (verbs.length-1))];
		/*
		var adjective2 = adjectives[Math.floor(Math.random() * (adjectives.length-1))];
		var comparative = comparatives[Math.floor(Math.random() * (comparatives.length-1))];
		var conjunction = conjunctions[Math.floor(Math.random() * (conjunctions.length-1))];
		var determiner = determiners[Math.floor(Math.random() * (determiners.length-1))];
		var determiner2 = determiners[Math.floor(Math.random() * (determiners.length-1))];
		var determiner3 = determiners[Math.floor(Math.random() * (determiners.length-1))];
		var interjection = interjections[Math.floor(Math.random() * (interjections.length-1))];
		var noun2 = nouns[Math.floor(Math.random() * (nouns.length-1))];
		var noun3 = nouns[Math.floor(Math.random() * (nouns.length-1))];
		var preposition = prepositions[Math.floor(Math.random() * (prepositions.length-1))];
		var verb2 = verbs[Math.floor(Math.random() * (verbs.length-1))];
		*/
	} catch (err) {
		console.log('somethings wrong. '+err)
	}
	// var sentence = determiner+" "+adjective+" "+noun+" "+adverb+" "+verb+" "+preposition+" "+determiner2+" "+noun2;
	var sentence = adjective+" "+noun+" "+adverb+" "+verb;
	return(sentence);
}
