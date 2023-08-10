var anum = []
var x1 = document.getElementById('x1')
var y1 = document.getElementById('y1')
var x2 = document.getElementById('x2')
var y2 = document.getElementById('y2')
var point1 = []
var point2 = []
var existPoint = true

function createLine(){
    if(x1.value.length == 0 || y1.value.length == 0 || x2.value.length == 0 || y2.value.length == 0){
        existPoint = false
        alert("Set all coordinates before")
    }
     else{
        point1.push(x1.value)
        point1.push(y1.value)
        point2.push(x2.value)
        point2.push(y2.value)
        alert(`Coordinates of point 1: (${point1[0]},${point1[1]}); coordinates of point 2: (${point2[0]},${point2[1]})`)
        }
        point1 = []
        point2 = []
}