let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");
canvas.style = "padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block;";

const canvasHeight = 880;
const canvasWidth = 980;

canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.style.background = "gray";

const centerX = canvasWidth / 2;
const centerY = canvasHeight / 2;
// ------------------------------
const dialPoints = new Map(); // end points of the dial
const r = 360;
let deg = 180;
let val = 0;

const edgeMinP = new Map(); // end values of minute
const edgeHrP = new Map();  // end values of hour
const rm = 330; // radius minute hand
const rh = 250; // radius hour hand
let hrVal = 0;

for (let i = 0; i < 60; i++) {
    // ------ dail points
    const offY = Math.round(Math.cos(deg * Math.PI / 180) * r);
    const offX = Math.round(Math.sin(deg * Math.PI / 180) * r);
    // ------------------
    // ------ minute points
    const offYMn = Math.round(Math.cos(deg * Math.PI / 180) * rm);
    const offXMn = Math.round(Math.sin(deg * Math.PI / 180) * rm);
    edgeMinP.set(val, {x: centerX + offXMn, y: centerY + offYMn});
    
    // -------------------
    if (deg % 30 == 0) {
        // hour point edges
        const offYHr = Math.round(Math.cos(deg * Math.PI / 180) * rh);
        const offXHr = Math.round(Math.sin(deg * Math.PI / 180) * rh);
        edgeHrP.set(hrVal, {x: centerX + offXHr, y: centerY + offYHr});
        hrVal++;
        // hour points on the dial
        dialPoints.set(val, {x: centerX + offX, y: centerY + offY, style: 'blue'});
    } else {
        // minute points
        dialPoints.set(val, {x: centerX + offX, y: centerY + offY, style: 'black'});
    }
    deg -= 6;
    val++;
}

// ------------------------------

function drawDial() {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    [...dialPoints.entries()].forEach(([k, v]) => {
        ctx.fillStyle = v.style;
        if (v.style == 'black') {
            ctx.fillRect(v.x - 5, v.y - 5, 10, 10);
        } else {
            ctx.fillRect(v.x - 10, v.y - 10, 20, 20);
        }
    })
}

function drawSecHand(m) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    

    // draw a line
    ctx.beginPath();
    ctx.moveTo(edgeMinP.get(m).x, edgeMinP.get(m).y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
}

function drawMinHand(m) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 10;

    // draw a line
    ctx.beginPath();
    ctx.moveTo(edgeMinP.get(m).x, edgeMinP.get(m).y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
}

function drawHrHand(h) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 10;

    // draw a line
    ctx.beginPath();
    ctx.moveTo(edgeHrP.get(h).x, edgeHrP.get(h).y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();
}


let lastTime = 0;
const fps = 1;
const nextFrame = 1000 / fps;
let timer = 0;

function animate(timeStamp) {
    const delta = timeStamp - lastTime;
    lastTime = timeStamp;
    const now = new Date(); // uses time on the local machine
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    if (timer >= nextFrame) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawDial();
        drawHrHand(22 % 12);
        drawMinHand(min);
        drawSecHand(sec);
        timer = 0;
    } else {
        timer += delta;
    }
    requestAnimationFrame(animate);
}

animate(0);