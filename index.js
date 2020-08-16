var canvas = document.getElementById('ctx');
var chatbox = document.getElementById('chat');
var ctx = canvas.getContext("2d");

var w = window.innerWidth;
var h = window.innerHeight;

var letters = {};
letters.a=
[[0,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,1],
 [1,1,0,0,0,0,1,1],
 [1,1,0,0,0,0,1,1],
 [1,1,1,1,1,1,1,1],
 [1,1,1,1,1,1,1,1],
 [1,1,0,0,0,0,1,1],
 [1,1,0,0,0,0,1,1]];
letters.l=
[[1,0,0,0,0,0,0,0],
 [1,1,0,0,0,0,0,0],
 [1,1,0,0,0,0,0,0],
 [1,1,0,0,0,0,0,0],
 [1,1,0,0,0,0,0,0],
 [1,1,0,0,0,0,0,0],
 [1,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,1]];
letters.e=
[[1,1,1,1,1,1,1,1],
 [1,1,1,1,1,1,1,0],
 [1,1,0,0,0,0,0,0],
 [1,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,0],
 [1,1,0,0,0,0,0,0],
 [1,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,1]];	   
letters.x=
[[1,1,0,0,0,0,1,1],
 [0,1,1,0,0,1,1,0],
 [0,0,1,1,1,1,0,0],
 [0,0,0,1,1,0,0,0],
 [0,0,0,1,1,0,0,0],
 [0,0,1,1,1,1,0,0],
 [0,1,1,0,0,1,1,0],
 [1,1,0,0,0,0,1,1]];
letters['2']=
[[0,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,1],
 [1,1,0,0,0,1,1,1],
 [0,0,0,0,1,1,1,0],
 [0,0,0,1,1,1,0,0],
 [0,0,1,1,1,0,0,0],
 [0,1,1,1,1,1,1,1],
 [1,1,1,1,1,1,1,1]];
letters.s=
[[0,1,1,1,1,1,1,0],
 [1,1,1,1,1,1,1,1],
 [1,1,0,0,0,0,0,0],
 [1,1,1,1,1,1,1,0],
 [0,1,1,1,1,1,1,1],
 [0,0,0,0,0,0,1,1],
 [1,1,1,1,1,1,1,1],
 [0,1,1,1,1,1,1,0]];
letters.w=
[[1,0,0,0,0,0,0,1],
 [1,1,0,0,0,0,1,1],
 [1,1,0,1,1,0,1,1],
 [1,1,0,1,1,0,1,1],
 [1,1,0,1,1,0,1,1],
 [1,1,0,1,1,0,1,1],
 [1,1,1,1,1,1,1,1],
 [0,1,1,1,1,1,1,0]];
letters.p=
[[0,1,1,1,1,1,0,0],
 [0,1,1,1,1,1,1,0],
 [0,1,1,0,0,1,1,0],
 [0,1,1,1,1,1,1,0],
 [0,1,1,1,1,1,0,0],
 [0,1,1,0,0,0,0,0],
 [0,1,1,0,0,0,0,0],
 [0,1,1,0,0,0,0,0]];


var mapSz = 10, pixSz = 3;
var devMode = false;
var opacity = .5, opacitySmooth = 1;
var alpha = 0, beta = 0, alphaList = new Array(5), betaList = new Array(5);
var mx = w/2, my = h/2, mrad = 18;
var camx = 0, camy = -16, camz = 0;
var frames = 0, fps = 0;
var d = new Date();
var bootTime = d.getTime();
var cube = {};
var mx = -5000, my = -5000, mb = -5000;
telegrama();

var sins = [];//Pretrig
for(var i = 0; i < 1571; i++)//500pi
	sins[i] = Math.sin(i / 1000.);

//intervals
setInterval(function(){
	w = window.innerWidth;
	h = window.innerHeight;
	if(canvas.width != w || canvas.height != h){
		canvas.width = w;
		canvas.height = h;
	}
	tick();
	render();
},10);
setInterval(function(){
	fps = frames;
	frames = 0;
},1000);


function tick(){
	for(var i = 4; i > 0; i--){
		alphaList[i] = alphaList[i-1];
		betaList[i] = betaList[i-1];
	}
	var newAngles = decay(alpha, beta, 10)
	alpha = newAngles.alpha;
	beta  = newAngles.beta;
	alphaList[0] = alpha;
	betaList[0] = beta;
	camx = Math.sin(alpha) * Math.cos(beta) * 5000;
	camy = Math.cos(alpha) * Math.cos(beta) * -5000;
	camz = Math.sin(beta) * -5000;
}


//rendering
function render() {
	frames++;
		
	var d = new Date();
	var startTimer = d.getTime();
		
	ctx.fillStyle = "black";
	opacitySmooth = (opacitySmooth*5+opacity)/6;
	ctx.globalAlpha = opacitySmooth;
	ctx.fillRect(0,0,w,h);
	ctx.globalAlpha = 1;
	rLand(startTimer - bootTime);
		
	var d = new Date();
	var endTimer = d.getTime();
	var t = endTimer - startTimer;
		
	if(devMode){
		ctx.fillRect(0,0,40,40);
		ctx.fillStyle = "white";
		ctx.fillText(t,8,16);
	}
}
function rLand(t){
	for(var x = -mapSz/2+.5; x <= mapSz/2-.5; x++)
		for(var y = -mapSz/2+.5; y <= mapSz/2-.5; y++)
			for(var z = -mapSz/2+.5; z <= mapSz/2-.5; z++){
				var coords = transform({x:x,y:y,z:z},t)
				project(coords.x, coords.y, coords.z, rgbToHex(posToColor(x),posToColor(y),posToColor(z)));
			}
}
function transform(cube,t){
	var timer = t/1500;
	var w = timer%1;
	var pd = Math.floor(timer) % 5;
	var effect = Math.floor(timer/5%8);
	var transformed;

	     if(effect == 0) var trans = vibrate(makeLetter(cube, 'alex', t),t);
	else if(effect == 1) var trans = warp1(warp1(makeSphere(cube),t),t);
	else if(effect == 2){var trans = rubiks(cube,t); transformed = trans;}
	else if(effect == 3) var trans = warp2(warp2(warp1(cube,t),t),t);
	else if(effect == 4) var trans = warp2(warp2(warp1(makeSphere(cube),t),t),t);
	else if(effect == 5) var trans = resonate(cube, t);
	else if(effect == 6) var trans = warp1(makeSphere(cube),t);
	else if(effect == 7) var trans = warp2(warp1(cube,t),t);
	if(effect != 2) transformed = trancerp(trans,cube,pd,w);
	return spinCrazy(transformed,t);
}
function spinCrazy(cube,t){
	var x = cube.x, y = cube.y, z = cube.z;
	var s1 = Math.sin(t/700)*.6; // make s1,2,3 t/1000 for more chaotic behavior.
	var s2 = Math.sin(t/500)*.6-Math.PI/2; // this rotates around an "anchor" orientation.
	var s3 = Math.sin(t/900)*.6+Math.PI/2; // while that rotates freely
	var x1 = Math.cos(s1+Math.atan2(y,x))*Math.hypot(x,y);
	var y1 = Math.sin(s1+Math.atan2(y,x))*Math.hypot(x,y);
	var z1 = z;
	var x2 = Math.cos(s2+Math.atan2(x1,z1))*Math.hypot(z1,x1);
	var y2 = y1;
	var z2 = Math.sin(s2+Math.atan2(x1,z1))*Math.hypot(z1,x1);
	var x3 = x2;
	var y3 = Math.sin(s3+Math.atan2(z2,y2))*Math.hypot(z2,y2);
	var z3 = Math.cos(s3+Math.atan2(z2,y2))*Math.hypot(z2,y2);
	return {x:x3,y:y3,z:z3};
}
function vibrate(cube,t){
	return {x:cube.x+Math.sin(cube.y+t/200)/3,y:cube.y+Math.sin(cube.z+t/200)/3,z:cube.z+Math.sin(cube.x+t/200)/3};
}
function resonate(cube,t){
	var dist = Math.sqrt(cube.x*cube.x+cube.y*cube.y+cube.z*cube.z);
	var fac = 1+.7*Math.sin(-t/200+dist)/dist;
	return {x:cube.x*fac,y:cube.y*fac,z:cube.z*fac};
}
function makeSphere(cube){
	var shift = cube.z+mapSz/2-.5;
	var x = (cube.x+mapSz/2-.5)*Math.PI*2/mapSz + shift%4*Math.PI/mapSz, y = (cube.y+mapSz/2-.5)*Math.PI*2/mapSz + (Math.floor(shift/2)+.5)*Math.PI*2/mapSz/mapSz;
	var siny = Math.sin(y);
	return {x:6*Math.cos(x)*siny,y:6*Math.sin(x)*siny,z:6*Math.cos(y)};
}
function warp1(cube, t){
	var x = cube.x, y = cube.y, z = cube.z;
	var s = t/1000;
	var x1 = Math.cos(s*(Math.PI-2)+Math.atan2(y,x))*Math.hypot(x,y);
	var y1 = Math.sin(s*(Math.PI-2)+Math.atan2(y,x))*Math.hypot(x,y);
	var z1 = z;
	var x2 = Math.cos(s+Math.atan2(z1,x1))*Math.hypot(z1,y1);
	var y2 = y1;
	var z2 = Math.sin(s+Math.atan2(z1,x1))*Math.hypot(z1,y1);
	var x3 = x2;
	var y3 = Math.sin(s*(Math.E-2)+Math.atan2(y2,z2))*Math.hypot(z2,y2);
	var z3 = Math.cos(s*(Math.E-2)+Math.atan2(y2,z2))*Math.hypot(z2,y2);
	return {x:x3,y:y3,z:z3};
}
function warp2(cube,t){
	var x = cube.x, y = cube.y, z = cube.z;
	var s = t/1000;
	var x1 = Math.cos(s*(Math.PI-2)+Math.atan2(y,x+.01))*Math.hypot(z,y);
	var y1 = Math.sin(s*(Math.PI-2)+Math.atan2(y,x+.01))*Math.hypot(z,y);
	var z1 = z;
	var x2 = Math.cos(s+Math.atan2(z1,x1+.01))*Math.hypot(z1,y1);
	var y2 = y1;
	var z2 = Math.sin(s+Math.atan2(z1,x1+.01))*Math.hypot(z1,y1);
	var x3 = x2;
	var y3 = Math.sin(s*(Math.E-2)+Math.atan2(y2,z2+.01))*Math.hypot(z2,y2);
	var z3 = Math.cos(s*(Math.E-2)+Math.atan2(y2,z2+.01))*Math.hypot(z2,y2);
	return {x:x3,y:y3,z:z3};
}
function smoothcerp(x){
	return -2*x*x*x+3*x*x;
}
function skewb(cube,t){
	var x = cube.x, y = cube.y, z = cube.z;
	var s = t/2000;
	var sint = Math.floor(s);
	var layer = (Math.floor(Math.exp(sint+3)) % mapSz) > (mapSz/2);
	var axis = sint % 4;
	var xn = x, yn = y, zn = z;
	var angle = smoothcerp(s % 1) * Math.PI * 2;
	switch(axis){
		default:
			if((x+y+z>0)^layer){
				yn = Math.sin(angle+Math.atan2(y,z))*Math.hypot(z,y);
				zn = Math.cos(angle+Math.atan2(y,z))*Math.hypot(z,y);
			}
			break;
		case 1:
			if((-x+y+z>0)^layer){
				xn = Math.cos(angle+Math.atan2(z,x))*Math.hypot(z,x);
				zn = Math.sin(angle+Math.atan2(z,x))*Math.hypot(z,x);
			}
			break;
		case 2:
			if((x-y+z>0)^layer){
				xn = Math.cos(angle+Math.atan2(y,x))*Math.hypot(x,y);
				yn = Math.sin(angle+Math.atan2(y,x))*Math.hypot(x,y);
			}
			break;
		case 3:
			if((x+y-z>0)^layer){
				xn = Math.cos(angle+Math.atan2(y,x))*Math.hypot(x,y);
				yn = Math.sin(angle+Math.atan2(y,x))*Math.hypot(x,y);
			}
			break;
	}
	return {x:xn,y:yn,z:zn};
}
function rubiks(cube,t){
	var x = cube.x, y = cube.y, z = cube.z;
	var s = t/1500;
	var sint = Math.floor(s);
	var layer = (Math.floor(Math.exp(sint+3)) % mapSz) > (mapSz/2);
	var axis = sint % 3;
	var xn = x, yn = y, zn = z;
	var angle = smoothcerp(s % 1) * Math.PI * 2;
	switch(axis){
		default:
			if((x>0)^layer){
				yn = Math.sin(angle+Math.atan2(y,z))*Math.hypot(z,y);
				zn = Math.cos(angle+Math.atan2(y,z))*Math.hypot(z,y);
			}
			break;
		case 1:
			if((y>0)^layer){
				xn = Math.cos(angle+Math.atan2(z,x))*Math.hypot(z,x);
				zn = Math.sin(angle+Math.atan2(z,x))*Math.hypot(z,x);
			}
			break;
		case 2:
			if((z>0)^layer){
				xn = Math.cos(angle+Math.atan2(y,x))*Math.hypot(x,y);
				yn = Math.sin(angle+Math.atan2(y,x))*Math.hypot(x,y);
			}
			break;
	}
	return {x:xn,y:yn,z:zn};
}
function cerp3d(a,b,w){
	return {x:cerp(a.x,b.x,w),y:cerp(a.y,b.y,w),z:cerp(a.z,b.z,w),skip:(a.skip||b.skip)};
}
function project(ax, ay, az, col) {
	/*This function was written independently, but I did use some of the mathematics described in
	this wikipedia page to develop it. https://en.wikipedia.org/wiki/3D_projection */
	
	var rAlpha = alpha;
	var rBeta = beta+Math.PI / 2;
	
	var r = 100;
	var sa = sine(rAlpha), ca = cosine(rAlpha);
	var sb = sine(rBeta), cb = cosine(rBeta);
	var sx = sb, cx = cb; //Pre-trig euler angles
	var sz = sa, cz = ca;
	var sy = 0, cy = 1; // Operating under pretense that gamma is 0
		
	var ex = 0, ey = 0, ez = r; // eye, relative to camera
		
	var ox = ax-camx, oy = ay-camy, oz = az-camz; // Translate relative to camera
		
	var par1 = sz*oy+cz*ox; // Preprocess some useful numbers for speed
	var par2 = cy*oz+sy*par1;
	var par3 = cz*oy-sz*ox;
	var dx = cy*par1-sy*oz; // spin in 3d to match camera's "perspective"
	var dy = sx*par2+cx*par3;
	var dz = cx*par2-sx*par3;
		
	var bx = ez*dx/dz-ex; // translate that to 2d
	var by = ez*dy/dz-ey;
	
	var xf = w/2+bx*1000; // final point center coordinates on screen
	var yf = h/2+by*1000;
	
	drawPointAt(xf, yf, col);
}
function drawPointAt(x, y, col){
	ctx.save();
	
	if(true){
		var dx = mx-x; dy = my-y;
		var dist = dx*dx+dy*dy;
		if(dist<mrad*mrad){
			dist=mrad*mrad;
			var theta = Math.atan2(dy,dx);
			x=mx-dist/mrad*Math.cos(theta);
			y=my-dist/mrad*Math.sin(theta);
		}
	}

	ctx.fillStyle = col;
	ctx.fillRect(x-pixSz/2,y-pixSz/2,pixSz,pixSz);
	ctx.restore();
}
function trancerp(trans,cube,pd,w){
	if(pd == 0) return cerp3d(trans,cube,w);
	else if(pd == 4) return cerp3d(cube,trans,w);
	else return trans;
}
function inBounds(x){
	return x>=0 && x<8;
}
function makeLetter(cube, str, t){
	var fit = true;
	var arr = 0;
	for(var i = 0; i < str.length; i++) if(cube.x == 1.5-i) {
		arr = letters[str.charAt(i)];
		break;
	}
	if(arr === 0) fit = false;
	fit = fit && inBounds(cube.y+mapSz/2-.5) && inBounds(cube.z+mapSz/2-.5) && arr[cube.y+mapSz/2-.5][cube.z+mapSz/2-.5] == 1;
	if(!fit) return scale(warp1(warp1(makeSphere(cube), t), t), 10);
	return scale({x:-cube.z+cube.x*(mapSz+1), y:0, z:-cube.y}, .3);
}
function scale(cube, scale){
	cube.x *= scale;
	cube.y *= scale;
	cube.z *= scale;
	return cube;
}

//math
function sine(x){
	x+=Math.PI * 200;
	x%=Math.PI * 2;
	var modpi = x % Math.PI;
	return (x > Math.PI?-1:1)*sins[Math.floor(((modpi < Math.PI / 2)?(modpi):(Math.PI - modpi)) * 1000)];
}
function cosine(x){
	return sine(x + Math.PI / 2);
}
function lerp(a,b,w){
	return a*w+b*(1-w);
}
function cerp(a,b,w){
	return lerp(a,b,6*(w*w/2-w*w*w/3));
}
function decay(alpha,beta,strength){
	var metaAngle = Math.atan2(beta,alpha);
	var hypot = Math.atan(Math.hypot(alpha,beta)*strength)/strength;
	return {alpha:Math.cos(metaAngle)*hypot, beta:Math.sin(metaAngle)*hypot};
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function posToColor(x){
	return Math.floor(((x/mapSz)+.5)*235+20);
}

//gfx
function telegrama(){
	ctx.font = "18px Telegrama";
}
function write(text, x, y, col, sz, align){
	ctx.save();
	if(col)   ctx.fillStyle = col;
	if(sz)    ctx.font = sz + "pt Telegrama";
	if(align) ctx.textAlign = align;
	ctx.fillText(text+"",x,y);
	ctx.restore();
}

document.addEventListener("mousemove",mouse);
document.addEventListener("mousedown",click);
document.addEventListener("keypress",function(){console.log("key");devMode ^= true;});

function click(){
	//opacity = opacity>.02?opacity/2:.5;
	console.log("Clicked! Opacity is now: " + opacity);
}
function mouse(e){
	mx = e.clientX;
	my = e.clientY;
	mb = e.button;
}






//No longer used transforms
function twistOuter(cube,t){
	var x = cube.x, y = cube.y, z = cube.z;
	var hypot = Math.floor((x*x+y*y+z*z)/5);
	var s = t*hypot/10000;
	var x1 = Math.cos(s+Math.atan2(y,x))*Math.hypot(x,y);
	var y1 = Math.sin(s+Math.atan2(y,x))*Math.hypot(x,y);
	var z1 = z;
	var x2 = Math.cos(s+Math.atan2(x1,z1))*Math.hypot(z1,x1);
	var y2 = y1;
	var z2 = Math.sin(s+Math.atan2(x1,z1))*Math.hypot(z1,x1);
	var x3 = x2;
	var y3 = Math.sin(s+Math.atan2(z2,y2))*Math.hypot(z2,y2);
	var z3 = Math.cos(s+Math.atan2(z2,y2))*Math.hypot(z2,y2);
	return {x:x3,y:y3,z:z3};
}
