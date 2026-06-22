// First part: Create beam or column

var x1 = document.getElementById('x1')
var y1 = document.getElementById('y1')
var x2 = document.getElementById('x2')
var y2 = document.getElementById('y2')

let points = [];
let selectedPoint = null;

let minX = 0, maxX = 0, minY = 0, maxY = 0;

var existPoint = true

canvas = document.getElementById("myCanvas")
context = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

function getCanvasSize() {
    return {
        w: canvas.width,
        h: canvas.height
    };
}

context.lineWidth = 2;

function defMaxMin(){
    minX = Infinity;
    maxX = -Infinity;
    minY = Infinity;
    maxY = -Infinity;
}

defMaxMin();


// Grid functions

const gridStep = 20;

function screenToWorld(x, y) {

    const w = canvas.width;
    const h = canvas.height;

    const translate_origin_x = (minX + maxX) / 2;
    const translate_origin_y = (minY + maxY) / 2;

    let factor;

    if ((maxX - minX) >= (maxY - minY)) {
        factor = w / (maxX - minX || 1);
    } else {
        factor = h / (maxY - minY || 1);
    }

    factor *= 0.8;

    return {
        x: (x - w / 2) / factor + translate_origin_x,
        y: (h / 2 - y) / factor + translate_origin_y  
    };
}

function worldToScreen(px, py, originX, originY, factor) {

    const w = canvas.width;
    const h = canvas.height;

    return {
        x: ((px - originX) * factor) + w / 2,
        y: h / 2 - ((py - originY) * factor)
    };
}

function snap(value) {
    return Math.round(value / gridStep) * gridStep;
}

function drawPoint(x, y, radius = 4) {

    context.fillStyle = "#3dac9f84";

    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);

    context.fill();
}

function drawGrid() {

    context.strokeStyle = "#4f4b4b55";
        context.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += gridStep) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridStep) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    context.fillStyle = "#666"; // point color

    for (let x = 0; x <= canvas.width; x += gridStep) {
        for (let y = 0; y <= canvas.height; y += gridStep) {

            context.beginPath();

            context.arc(
                x,
                y,
                1, // point radio
                0,
                Math.PI * 2
            );

            context.fill();
        }
    }

}

function render() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawPoint();
    drawGrid();
    createDraw();

}

function getMouse(event) {

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };

}


function createLine() {

    if (
        x1.value === "" ||
        y1.value === "" ||
        x2.value === "" ||
        y2.value === ""
    ) {
        alert("Set all coordinates before");
        return;
    }

    points.push([
        Number(x1.value),
        Number(y1.value)
    ]);

    points.push([
        Number(x2.value),
        Number(y2.value)
    ]);

    updateBounds();
    render();
    console.log(points)
}

function updateBounds() {

    defMaxMin();

    for (let i = 0; i < points.length; i++) {

        const x = points[i][0];
        const y = points[i][1];

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
    }
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = "#000000";
    context.lineWidth = 1.5;
    context.stroke();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    defMaxMin();
    drawPoint();
    drawGrid();
}

function undoLine() {
    points.pop();
    points.pop();
    updateBounds();
    render();
}


function createDraw() {

    if (points.length < 2) return;

    const size = getCanvasSize();
    const w = size.w;
    const h = size.h;

    let minXLocal = minX;
    let maxXLocal = maxX;
    let minYLocal = minY;
    let maxYLocal = maxY;

    if (!isFinite(minXLocal) || !isFinite(maxXLocal)) {
        minXLocal = -50;
        maxXLocal = 50;
        minYLocal = -50;
        maxYLocal = 50;
    }

    const translate_origin_x = (minXLocal + maxXLocal) / 2;
    const translate_origin_y = (minYLocal + maxYLocal) / 2;

    let factor;

    const dx = maxXLocal - minXLocal || 1;
    const dy = maxYLocal - minYLocal || 1;

    if (dx >= dy) {
        factor = w / dx;
    } else {
        factor = h / dy;
    }

    factor *= 0.8;

    for (let i = 0; i < points.length; i += 2) {

        const p1 = points[i];
        const p2 = points[i + 1];

        const p1x = ((p1[0] - translate_origin_x) * factor) + w / 2;
        const p1y = h / 2 - ((p1[1] - translate_origin_y) * factor);

        const p2x = ((p2[0] - translate_origin_x) * factor) + w / 2;
        const p2y = h / 2 - ((p2[1] - translate_origin_y) * factor);

        drawLine(p1x, p1y, p2x, p2y);
        drawPoint(p1x, p1y, 4);
        drawPoint(p2x, p2y, 4);
    }
}

// Add click on grid function

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

}


window.addEventListener("resize", () => {
    resizeCanvas();
    render();
});

canvas.addEventListener("click", function (event) {

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const snappedX = Math.round(x / gridStep) * gridStep;
    const snappedY = Math.round(y / gridStep) * gridStep;

    // If there is no bar, so create an initial system
    if (points.length === 0) {
        minX = -10;
        maxX = 10;
        minY = -10;
        maxY = 10;
    }

    const world = screenToWorld(snappedX, snappedY);

    if (selectedPoint === null) {

        // First click
        selectedPoint = [world.x, world.y];

    } else {

        // Second click
        points.push(selectedPoint);
        points.push([world.x, world.y]);

        selectedPoint = null;

        render();
    }

    console.log(points);
});

function fitCanvas() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}

function initCanvas() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    render();
}

let viewMinX, viewMaxX;
let viewMinY, viewMaxY;

function fitView() {

    updateBounds();

    viewMinX = minX;
    viewMaxX = maxX;
    viewMinY = minY;
    viewMaxY = maxY;

    render();
}

function zoomIn() {

    const zoomFactor = 0.8; // 20% mais próximo

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const halfWidth = (maxX - minX) * zoomFactor / 2;
    const halfHeight = (maxY - minY) * zoomFactor / 2;

    minX = centerX - halfWidth;
    maxX = centerX + halfWidth;
    minY = centerY - halfHeight;
    maxY = centerY + halfHeight;

    render();
}

function zoomOut() {

    const zoomFactor = 1.25; // 25% mais distante

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const halfWidth = (maxX - minX) * zoomFactor / 2;
    const halfHeight = (maxY - minY) * zoomFactor / 2;

    minX = centerX - halfWidth;
    maxX = centerX + halfWidth;
    minY = centerY - halfHeight;
    maxY = centerY + halfHeight;

    render();
}

window.addEventListener("load", initCanvas);
window.addEventListener("resize", initCanvas);

// Second part: Add loads
var divLM = document.getElementById('settLM')
var divRec = document.getElementById('settRec')
var divTrap = document.getElementById('settTrap')
var div1d = document.getElementById('sett1deg')
var div2d = document.getElementById('sett2deg')
var div3d = document.getElementById('sett3deg')
var divCreateLoad = document.getElementById('createLoad')
var divUndoLoad = document.getElementById('undoLoad')
var divClearLoad = document.getElementById('clearLoad')
var divCreateBC = document.getElementById('createBC')
var divUndoBC = document.getElementById('undoBC')
var divClearBC = document.getElementById('clearBC')
var textLoad = document.getElementById('load-settings')
var textBC = document.getElementById('boundary-settings')
var display = 1

function showSettMLoad(){
    if(display == 1)
    {
        divCreateLoad.style.display = 'none';
        divUndoLoad.style.display = 'none';
        divClearLoad.style.display = 'none';
        divRec.style.display = 'none';
        divTrap.style.display = 'none';
        divLM.style.display = 'block';
        divCreateLoad.style.display = 'block';
        divUndoLoad.style.display = 'block';
        divClearLoad.style.display = 'block';
        textLoad.innerHTML = '';
    }
}

function showSettRecLoad(){
    if(display == 1)
    {
        divCreateLoad.style.display = 'none';
        divUndoLoad.style.display = 'none';
        divClearLoad.style.display = 'none';
        divLM.style.display = 'none';
        divTrap.style.display = 'none';
        divRec.style.display = 'block';
        divCreateLoad.style.display = 'block';
        divUndoLoad.style.display = 'block';
        divClearLoad.style.display = 'block';
        textLoad.innerHTML = '';
    }
}

function showSettTrapLoad(){
    if(display == 1)
    {
        divCreateLoad.style.display = 'none';
        divUndoLoad.style.display = 'none';
        divClearLoad.style.display = 'none';
        divLM.style.display = 'none';
        divRec.style.display = 'none';
        divTrap.style.display = 'block';
        divCreateLoad.style.display = 'block';
        divUndoLoad.style.display = 'block';
        divClearLoad.style.display = 'block';
        textLoad.innerHTML = '';
    }
}

function show1deg(){
    if(display == 1)
    {
        divCreateBC.style.display = 'none';
        divUndoBC.style.display = 'none';
        divClearBC.style.display = 'none';
        div2d.style.display = 'none';
        div3d.style.display = 'none';
        div1d.style.display = 'block';
        divCreateBC.style.display = 'block';
        divUndoBC.style.display = 'block';
        divClearBC.style.display = 'block';
        textBC.innerHTML = '';
    }
}

function show2deg(){
    if(display == 1)
    {
        divCreateBC.style.display = 'none';
        divUndoBC.style.display = 'none';
        divClearBC.style.display = 'none';
        div1d.style.display = 'none';
        div3d.style.display = 'none';
        div2d.style.display = 'block';
        divCreateBC.style.display = 'block';
        divUndoBC.style.display = 'block';
        divClearBC.style.display = 'block';
        textBC.innerHTML = '';
    }
}

function show3deg(){
    if(display == 1)
    {
        divCreateBC.style.display = 'none';
        divUndoBC.style.display = 'none';
        divClearBC.style.display = 'none';
        div1d.style.display = 'none';
        div2d.style.display = 'none';
        div3d.style.display = 'block';
        divCreateBC.style.display = 'block';
        divUndoBC.style.display = 'block';
        divClearBC.style.display = 'block';
        textBC.innerHTML = '';
    }
}
// function createPorMLoad(){

// }

// function createRecLoad(){

// }

// function createTrapLoad(){

// }


// function create1deg(){

// }

// function create2deg(){

// }

// function create3deg(){

// }