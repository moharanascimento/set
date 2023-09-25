var x1 = document.getElementById('x1')
var y1 = document.getElementById('y1')
var x2 = document.getElementById('x2')
var y2 = document.getElementById('y2')

points = []
var existPoint = true

canvas = document.getElementById("myCanvas")
context = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

context.lineWidth = 2;

function defMaxMin(){
    minX = Infinity;
    maxX = -Infinity;
    minY = Infinity;
    maxY = -Infinity;
}

function createLine() {
    if (x1.value.length == 0 || y1.value.length == 0 || x2.value.length == 0 || y2.value.length == 0) {
        existPoint = false
        alert("Set all coordinates before")
    } else {
        var coordX1 = x1.value;
        var coordX2 = x2.value;
        var coordY1 = y1.value;
        var coordY2 = y2.value;

        points.push([Number(coordX1), Number(coordY1)]);
        points.push([Number(coordX2), Number(coordY2)]);
        console.log(points);

        defMaxMin();
        verifyMaxMin();
        createDraw(minX, minY, maxX, maxY);
    }
}

function verifyMaxMin(){
    for(var i = 0; i<points.length-1; i++){
        j = i+1
        console.log(points)
        maxX = Math.max(...[maxX,points[i][0],points[j][0]]);
        maxY = Math.max(...[maxY,points[i][1],points[j][1]]);
        minX = Math.min(...[minX,points[i][0],points[j][0]]);
        minY = Math.min(...[minY,points[i][1],points[j][1]]);
    }
}

function drawLine(x1, y1, x2, y2) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function clearCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    points = [];
    defMaxMin();
}

function undoLine() {
    points.pop();
    points.pop();
    defMaxMin();
    verifyMaxMin();
    createDraw(minX, minY, maxX, maxY);
}

function createDraw(minX, minY, maxX, maxY) {
    centerX = ((maxX - minX) / 2)
    centerY = ((maxY - minY) / 2)

    if (maxX == 0 && minX == 0) {
        somaX = canvasWidth / 2
    }
    else {
        somaX = (canvasWidth / 2) - centerX
    }

    if (maxY == 0 && minY == 0) {
        somaY = canvasHeight / 2
    }
    else {
        somaY = (canvasHeight / 2) - centerY
    }

    // calculate scale
    if ((maxX - minX) >= (maxY - minY)) {
        factor = (canvasWidth) / (maxX - minX)
    } else {
        factor = (canvasHeight) / (maxY - minY)
    }

    factor *= 0.8

    const translate_origin_x = minX + (maxX - minX)/2
    const translate_origin_y= minY + (maxY - minY)/2

    console.log(factor)
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var count = 0; count < points.length; count += 2) {
        aux1 = count
        aux2 = count + 1
        console.log(`count: ${aux1} aux: ${aux2}`)
        p1x = ((points[aux1][0]-translate_origin_x) * factor)+canvasWidth/2
        p1y = ((points[aux1][1]-translate_origin_y) * factor)+canvasHeight/2
        p2x = ((points[aux2][0]-translate_origin_x) * factor)+canvasWidth/2
        p2y = ((points[aux2][1]-translate_origin_y) * factor)+canvasHeight/2
        console.log(`${p1x},${p1y},${p2x},${p2y}`)
        drawLine(p1x, p1y, p2x, p2y)
        console.log(points)
    }
}
