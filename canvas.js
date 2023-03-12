let canvas = document.querySelector("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

let mouseDown = false;

let pencilColor = document.querySelectorAll(".pencil-color")
let pencilWidthEle = document.querySelector(".pencil-width")
let eraserWidthEle = document.querySelector(".eraser-width")
let download = document.querySelector(".download") 
let redo = document.querySelector(".redo")
let undo = document.querySelector(".undo")

let undoRedoTracker = []
let tracker = 0

let penColor = "black"
let eraserColor = "white"
let penWidth = pencilWidthEle.value 
let eraserWidth = eraserWidthEle.value

//API
let tool = canvas.getContext("2d")

tool.strokeStyle = penColor
tool.lineWidth = penWidth

// mousedown -> start new path
canvas.addEventListener("mousedown" , (e) =>{
    mouseDown = true
    beginPath({
        x :e.clientX,
        y : e.clientY
    })
})

// mousemove -> path fill (graphics)
canvas.addEventListener("mousemove", (e) =>{
   if(mouseDown == true){
      drawStroke({
        x :e.clientX,
        y : e.clientY,
        color : eraserFlag ? eraserColor : penColor,
        width : eraserFlag ? eraserWidth : penWidth
      })
   }
})

canvas.addEventListener("mouseup" , (e) =>{
    mouseDown = false;

    // actions performed -> work for action tracker
    let url = canvas.toDataURL()
    undoRedoTracker.push(url)
    tracker = undoRedoTracker.length-1
})

undo.addEventListener("click" , (e) => {
    if(tracker > 0){
        tracker--
    }

    let trackObj = {
        trackValue : tracker,
        undoRedoTracker
    }

    undoRedoCanvas(trackObj)
})

redo.addEventListener("click" , (e) => {
    if(tracker < undoRedoTracker.length-1){
        tracker++   
    }

    let trackObj = {
        trackValue : tracker,
        undoRedoTracker
    }

    undoRedoCanvas(trackObj)
})

function undoRedoCanvas(trackObj){
    tracker = trackObj.trackValue
    undoRedoTracker = trackObj.undoRedoTracker

    let url = undoRedoTracker[tracker]
    let img = new Image()
    img.src = url
    img.onload = (e) =>{
        tool.drawImage(img , 0 , 0 , canvas.width , canvas.height)
    }
}

function beginPath(strokeObj){
    tool.beginPath()
    tool.moveTo(strokeObj.x , strokeObj.y)
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color
    tool.lineWidth = strokeObj.width
    tool.lineTo(strokeObj.x , strokeObj.y)
    tool.stroke()
}

pencilColor.forEach((colorEle) => {
    colorEle.addEventListener("click" , (e) =>{
        let color = colorEle.classList[1]
        penColor = color
        tool.strokeStyle = penColor
    })
})

pencilWidthEle.addEventListener("change" , (e) =>{
    penWidth = pencilWidthEle.value
    tool.lineWidth = penWidth
})

eraserWidthEle.addEventListener("change" , (e) =>{
    eraserWidth = eraserWidthEle.value
    tool.lineWidth = eraserWidth
})

eraser.addEventListener("click" , (e) =>{
    if(eraserFlag == true){
        tool.strokeStyle = eraserColor
        tool.lineWidth = eraserWidth
    }
    else{
        tool.strokeStyle = penColor
        tool.lineWidth = penWidth
    }
})

download.addEventListener("click" , (e) => {
    let url = canvas.toDataURL()

    let a = document.createElement("a")
    a.href = url
    a.download = "openboard.jpg"
    a.click()
})