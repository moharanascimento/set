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

// const originX = canvasWidth*(1.5/8); 
// const originY = canvasHeight*(5/7); 

// context.fillRect(originX-5, originY-5, 10, 10);

context.lineWidth = 2;

minX = Infinity;
maxX = -Infinity;
minY = Infinity;
maxY = -Infinity;

function createLine(){
    if(x1.value.length == 0 || y1.value.length == 0 || x2.value.length == 0 || y2.value.length == 0){
        existPoint = false
        alert("Set all coordinates before")
    } else{

        var coordX1 = x1.value;
        var coordX2 = x2.value;
        var coordY1 = y1.value;
        var coordY2 = y2.value;                        
        
        // alert(`${canvasWidth},${canvasHeight}`);
        points.push([Number(coordX1),Number(coordY1)]);
        points.push([Number(coordX2),Number(coordY2)]);
        console.log(points);

        if (coordX1<minX){
            minX = coordX1
        }
        if (coordX2<minX){
            minX = coordX2
        }
        if (coordY1<minY){
            minY = coordY1
        }
        if (coordY2<minY){
            minY = coordY2
        }

        if (coordX1>maxX){
            maxX = coordX1
        }
        if (coordX2>maxX){
            maxX = coordX2
        }
        if (coordY1>maxY){
            maxY = coordY1
        }
        if (coordY2>maxY){
            maxY = coordY2
        }

        createDraw(minX,minY,maxX,maxY);
}
}

function drawLine(x1,y1,x2,y2){
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}

function createDraw(minX,minY,maxX,maxY){
    centerX = ((maxX-minX)/2)
    centerY = ((maxY-minY)/2)

    if(maxX == 0 && minX == 0){
        somaX = canvasWidth/2
    }
    else{
        somaX = (canvasWidth/2)-centerX
    }

    if(maxY == 0 && minY == 0){
        somaY = canvasHeight/2
    }
    else{
        somaY = (canvasHeight/2)-centerY
    }

    console.log(somaY)
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    console.log('create line')
    
    for (var count = 0; count<points.length; count+=2){
        aux1 = count
        aux2 = count+1
        console.log(`count: ${aux1} aux: ${aux2}`)
        p1x = points[aux1][0]+somaX
        p1y = canvasHeight-points[aux1][1]-somaY
        p2x = points[aux2][0]+somaX
        p2y = canvasHeight-points[aux2][1]-somaY
        drawLine(p1x,p1y,p2x,p2y)
        console.log(points)
    }
}

