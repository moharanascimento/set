// First part: Create beam or column

var x1 = document.getElementById('x1')
var y1 = document.getElementById('y1')
var x2 = document.getElementById('x2')
var y2 = document.getElementById('y2')

points = []
var existPoint = true

canvas = document.getElementById("myCanvas")
context = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

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
        // p1y = ((points[aux1][1]-translate_origin_y) * factor)+canvasHeight/2
        p1y = canvasHeight-(((points[aux1][1]-translate_origin_y) * factor)+canvasHeight/2)
        p2x = ((points[aux2][0]-translate_origin_x) * factor)+canvasWidth/2
        // p2y = ((points[aux2][1]-translate_origin_y) * factor)+canvasHeight/2
        p2y = canvasHeight-(((points[aux2][1]-translate_origin_y) * factor)+canvasHeight/2)
        console.log(`${p1x},${p1y},${p2x},${p2y}`)
        drawLine(p1x, p1y, p2x, p2y)
        console.log(points)
    }
}

// Second part: Add loads
var box = document.getElementById('load-settings')

function createInput(axis,count){
    var element = document.createElement('input');
    element.setAttribute('type','number');
    element.setAttribute('name',axis+'l'+count); // to form xl1 ou xl2 or yl1 or yl2
    element.setAttribute('id', axis+'l'+count);
    //element.style.margin = '20px';
    element.style.marginTop = '10px';
    element.style.marginLeft = '10px';
    element.style.marginBottom = '10px';
    element.style.width = '50px'
    element.style.height = '25px'
    element.style.display = 'inline'
    element.style.alignSelf = 'center'
    box.appendChild(element);
}

function createLabel(name){
    var element = document.createElement('label');
    element.setAttribute('for','name');
    element.innerHTML = name.bold();
    element.style.marginRight = '10px';
    box.appendChild(element);
}

function buttonLoad(){
    var element = document.createElement('input');
    element.setAttribute('type', 'button');
    element.setAttribute('value', 'Create Load');
    element.setAttribute('onClick', 'createLoad()');
    element.style.backgroundColor= '#3dac9f';
    element.style.borderRadius = '20px';
    element.style.width = '100%';
    element.style.height = '30px';
    element.style.display = 'block';
    element.style.width = '100px'
    element.style.fontFamily = 'Arial'
    element.style.fontSize = '1rem'
    element.style.fontWeight = '400'
    element.style.color = '#000000be'
    element.style.margin = 'auto'
    element.style.textAlign = 'center'

    element.addEventListener('mouseover', () => {
        element.style.backgroundColor = '#3dac9f79';
      });

      element.addEventListener('mouseout', () => {
        element.style.backgroundColor = '#3dac9f';
      });

    box.appendChild(element);
}

function createPorMLoad(){
    box.innerHTML = ''
    createInput('x',1)
    createLabel('x&ensp;')
    createInput('y',1)
    createLabel('y&ensp;')
    createInput('P','x')
    createLabel('Px')
    createInput('P','y')
    createLabel('Py')
    createInput('M','x')
    createLabel('Mx')
    createInput('M','y')
    createLabel('My')
    buttonLoad()
}

function createRecLoad(){
    box.innerHTML = ''
    createInput('x',1)
    createLabel('x&ensp;')
    createInput('y',1)
    createLabel('y&ensp;')
    createInput('Q','x')
    createLabel('Qx')
    createInput('Q','y')
    createLabel('Qy')
    buttonLoad()
}

function createTrapLoad(){
    box.innerHTML = ''
    createInput('x',1)
    createLabel('x')
    createInput('y',1)
    createLabel('y')
    createInput('Q','x1')
    createLabel('Qx1')
    createInput('Q','x2')
    createLabel('Qx2')
    createInput('Q','y1')
    createLabel('Qy1')
    createInput('Q','y2')
    createLabel('Qy2')
    buttonLoad()
}

var box2 = document.getElementById('boundary-settings')

function createInput2(axis,count){
    var element = document.createElement('input');
    element.setAttribute('type','number');
    element.setAttribute('name',axis+'l'+count); // to form xl1 ou xl2 or yl1 or yl2
    element.setAttribute('id', axis+'l'+count);
    element.style.marginTop = '10px';
    element.style.marginLeft = '50px';
    element.style.marginBottom = '10px';
    element.style.width = '50px'
    element.style.height = '25px'
    box2.appendChild(element);
}

function createLabel2(name){
    var element = document.createElement('label');
    element.setAttribute('for','name');
    element.innerHTML = name.bold();
    element.style.marginRight = '10px';
    box2.appendChild(element);
}

function buttonBoundary(){
    var element = document.createElement('input');
    element.setAttribute('type', 'button');
    element.setAttribute('value', 'Create BC');
    element.setAttribute('onClick', 'createBC()');
    element.style.backgroundColor= '#3dac9f';
    element.style.borderRadius = '20px';
    element.style.width = '100%';
    element.style.height = '30px';
    element.style.display = 'block';
    element.style.width = '100px'
    element.style.fontFamily = 'Arial'
    element.style.fontSize = '1rem'
    element.style.fontWeight = '400'
    element.style.color = '#000000be'
    element.style.margin = 'auto'
    element.style.textAlign = 'center'

    element.addEventListener('mouseover', () => {
        element.style.backgroundColor = '#3dac9f79';
      });

      element.addEventListener('mouseout', () => {
        element.style.backgroundColor = '#3dac9f';
      });

    box2.appendChild(element);
}

function create1deg(){
    box2.innerHTML = ''
    createInput2('x',1)
    createLabel2('x')
    createInput2('y',1)
    createLabel2('y')
    buttonBoundary()
}

function create2deg(){
    box2.innerHTML = ''
    createInput2('x',1)
    createLabel2('x')
    createInput2('y',1)
    createLabel2('y')
    buttonBoundary()
}

function create3deg(){
    box2.innerHTML = ''
    createInput2('x',1)
    createLabel2('x')
    createInput2('y',1)
    createLabel2('y')
    buttonBoundary()
}