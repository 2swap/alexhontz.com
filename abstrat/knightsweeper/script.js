var ctx;
var canvas;
var canvasSz = 512;
var tileSz = 32;
var prob = 7;
var tiles = canvasSz / tileSz;
var open = new Array(tiles * tiles);
var mine = new Array(tiles * tiles);
var flag = new Array(tiles * tiles);

window.onload = function() {
	resetTiles();
	canvas = document.getElementById("canvas");
	canvas.addEventListener("mousedown", onClick, false);
	
    ctx = canvas.getContext("2d");
    ctx.canvas.width = canvasSz;
    ctx.canvas.height = canvasSz;
	renderGrid();
};

function resetTiles(){
	for (var i = 0; i < open.length; i++) {
		open[i] = false;
		flag[i] = false;
		mine[i] = Math.random() < 1 / prob;
	}
}

function renderGrid(){
	for (var i = 0; i < open.length; i++) {
		var id = getImg(i);
		var x = (i % tiles) * tileSz;
		var y = Math.floor(i / tiles) * tileSz;
		drawTile(x, y, id);
	}
}

function drawTile(x, y, id) {
	var drawing = new Image();
	drawing.src = id;
	drawing.onload = function() {
		ctx.drawImage(drawing, x, y);
	}
}

function onClick(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
	var i = Math.floor(x / tileSz) + Math.floor(y / tileSz) * tiles;
	if(event.button == 0)
		flood(i);
	else if(getImg(i) == "images/ue.png" || getImg(i) == "images/uf.png")
		flag[i] = !flag[i];
	renderGrid();
}

function flood(i) {
	var x = i % tiles, y = i / tiles;
	if(getImg(i) == "images/ue.png") {
		open[i] = true;
		if(getImg(i) == "images/o0.png") {
			if(x > 0 && y > 1) flood(i - tiles*2 - 1);
			if(x > 1 && y > 0) flood(i - tiles - 1*2);
			
			if(x < tiles - 1 && y > 1) flood(i - tiles*2 + 1);
			if(x < tiles - 2 && y > 0) flood(i - tiles + 1*2);
			
			if(x > 0 && y < tiles - 2) flood(i + tiles*2 - 1);
			if(x > 1 && y < tiles - 1) flood(i + tiles - 1*2);
			
			if(x < tiles - 1 && y < tiles - 2) flood(i + tiles*2 + 1);
			if(x < tiles - 2 && y < tiles - 1) flood(i + tiles + 1*2);
		}
		else if(getImg(i) == "images/om.png")
		resetTiles();
	}
}

function getImg(i, flood) {
	if(flag[i])
		return "images/uf.png";
	if(!open[i])
		return "images/ue.png";
	if(mine[i])
		return "images/om.png";
	var surround = 0;
	
	var x = i % tiles, y = i / tiles;
	
	if(x > 0 && y > 1) if(mine[i - tiles*2 - 1])surround++;
	if(x > 1 && y > 0) if(mine[i - tiles - 1*2])surround++;
	
	if(x < tiles - 1 && y > 1) if(mine[i - tiles*2 + 1])surround++;
	if(x < tiles - 2 && y > 0) if(mine[i - tiles + 1*2])surround++;
	
	if(x > 0 && y < tiles - 2) if(mine[i + tiles*2 - 1])surround++;
	if(x > 1 && y < tiles - 1) if(mine[i + tiles - 1*2])surround++;
	
	if(x < tiles - 1 && y < tiles - 2) if(mine[i + tiles*2 + 1])surround++;
	if(x < tiles - 2 && y < tiles - 1) if(mine[i + tiles + 1*2])surround++;
	
	return "images/o" + surround + ".png";
}
