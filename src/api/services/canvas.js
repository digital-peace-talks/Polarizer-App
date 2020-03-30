
function wrapText(context, text, x, y, maxWidth, lineHeight) {

	var lines = text.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var words = lines[i].split(' ');
		var line = '';
		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
		y += lineHeight;
	}
}

function cropImage(ctx, canvas) {

	var w = canvas.width;
	var h = canvas.height;
	var pix = { x: [], y: [] };
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var x;
	var y;
	var index;

	for(y = 0; y < h; y++) {
		for(x = 0; x < w; x++) {
			index = (y * w + x) * 4;
			if(imageData.data[index + 3] > 0) {
				pix.x.push(x);
				pix.y.push(y);
			}
		}
	}
	pix.x.sort(function(a, b) { return a - b });
	pix.y.sort(function(a, b) { return a - b });
	var n = pix.x.length - 1;

	w = pix.x[n] - pix.x[0] + 1;
	h = pix.y[n] - pix.y[0] + 1;
	var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

	canvas.width = w;
	canvas.height = h;
	ctx.putImageData(cut, 0, 0);
	return (ctx);
}

function textCanvas(text, options) {
	if(!options) {
		options = {};
	}
	//Set width an height for plane
	var planeWidth = options.width || 4.8;
	var planeHeight = options.height || 3.2; //10;

	//Set width and height for dynamic texture using same multiplier
	var DTWidth = planeWidth * 100; //64;
	var DTHeight = planeHeight * 100; //64

	var dynamicTexture = new BABYLON.DynamicTexture(
		"DynamicTexture",
		{
			width: DTWidth,
			height: DTHeight
		}, currentScene);

	//Check width of text for given font type at any size of font
	dynamicTexture.hasAlpha = true;

	var textureContext = dynamicTexture.getContext();
	textureContext.font = (options.fontSize || "22") + "px DPTFont";
	textureContext.save();
	textureContext.fillStyle = options.color || "#00ccff";

	wrapText(textureContext, text, 5, options.fontSize || 22, DTWidth -1, options.fontSize || 22);
	textureContext = cropImage(textureContext, textureContext.canvas);

	dynamicTexture.update();
	return({
		dt: dynamicTexture,
		tc: textureContext,
		width: textureContext.canvas.width,
		height: textureContext.canvas.height,
		pd: { x: 1/DTWidth * textureContext.canvas.width * 2.4, y: 1/DTHeight * textureContext.canvas.height * 1.6 },
		pngBase64: async () => {return(textureContext.canvas.toDataURL("image/png", 0.99)); }
	});
}

module.exports.draw = async () => {
	const { createCanvas, loadImage } = require('canvas')
	const canvas = createCanvas(200, 200)
	const ctx = canvas.getContext('2d')

	canvas.hasAlpha = true;
	// Write "Awesome!"
	ctx.font = '30px Sans'
	ctx.rotate(0.1)
	ctx.fillText('awesome!', 50, 100)

	// Draw line under text
	var text = ctx.measureText('Awesome!')
	ctx.strokeStyle = 'rgba(0,0,0,0.5)'
	ctx.beginPath()
	ctx.lineTo(50, 102)
	ctx.lineTo(50 + text.width, 102)
	ctx.stroke()

	return canvas;
}
