var nodes = [];
var edges = [];
var r = 20;

var add_city = false;
var add_edge = false;
var add_weight = false;
var modify_city_name = false;

var firstNode = null;
var secondNode = null;

function AddCity(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    var id = nodes.length + 1;
    nodes.push({x, y, id});
    console.log(id);
    draw();
}

function AddEdge(event) {
    var clickedNode = null;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let dx = event.offsetX - node.x;
        let dy = event.offsetY - node.y;
        if (dx * dx + dy * dy <= r * r) {
            clickedNode = node;
            break;
        }
    }
    if(clickedNode !== null) {
        if (firstNode === null) {
            firstNode = clickedNode;
            } else {
            secondNode = clickedNode;
            edges.push({firstNode, secondNode});
            firstNode = null;
            secondNode = null;
        }
    }
    draw();
}

function in_circle(event) {
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let x = event.offsetX, y = event.offsetY;
        let dx = x - node.x, dy = y - node.y;
        if(dx * dx + dy * dy < r * r) {
            return true;
        }
    }

    return false;
}

function AddWeight(event) {
    var clickedEdge = null;
    if (in_circle(event)) return;
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let x1 = edge.firstNode.x, x2 = edge.secondNode.x;
        let y1 = edge.firstNode.y, y2 = edge.secondNode.y;
        let x0 = event.offsetX, y0 = event.offsetY;
        
        let A = y2-y1, B = x1-x2, C = x2*y1 - x1*y2;
        let distance = Math.abs(A * x0 + B * y0 + C) / Math.sqrt(A * A + B * B);

        if(distance <= 5)
        {
            clickedEdge = edge;
            break;
        }
    }
    var weight = prompt('请输入边的权重');
    if (weight!== null) {
        clickedEdge.weight = parseInt(weight);
        draw();
    }
}


function setupCanvasEvents() {
    var canvas = document.getElementById('cityNetwork');
    var add = document.getElementById("add");
    var connect = document.getElementById("connect");
    var weight = document.getElementById("weight");
    add.dataset.selected = "false";
    connect.dataset.selected = "false";
    weight.dataset.selected = "false";

    add.onclick = function(event) {
        if(add_edge || add_weight) return;
        var isSelected = JSON.parse(this.dataset.selected);
        
        this.dataset.selected = !isSelected; 
        this.style.backgroundColor = isSelected ? "" : "gray"; 

        if (!isSelected) {
            add_city = true;
        }
        if(isSelected) {
            add_city = false;
        }
    };

    connect.onclick = function(event) {
        if(add_city || add_weight) return;
        var isSelected = JSON.parse(this.dataset.selected);
        
        this.dataset.selected = !isSelected; 
        this.style.backgroundColor = isSelected ? "" : "gray"; 

        if (!isSelected) {
            add_edge = true;
        }
        if(isSelected) {
            add_edge = false;
        }
    };

    weight.onclick = function(event) {
        if(add_edge || add_city) return;
        var isSelected = JSON.parse(this.dataset.selected);
        
        this.dataset.selected = !isSelected; 
        this.style.backgroundColor = isSelected ? "" : "gray"; 

        if (!isSelected) {
            add_weight = true;
        }
        if(isSelected) {
            add_weight = false;
        }
    };

    var clear = document.getElementById("clear")
    clear.onclick = function() {
        nodes = [];
        edges = [];
        draw();
    }
 
    canvas.onmousedown = function (event) {
        if(add_city) {
            AddCity(event);
        } else if(add_edge) {
            AddEdge(event);
        } else if(add_weight) {
            AddWeight(event);
        }
    }

}




function draw() {
    var canvas = document.getElementById('cityNetwork');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        context.beginPath();
        context.fillStyle = "blue";
        context.arc(node.x, node.y, r, 0, Math.PI * 2);
        context.fill();
        context.font = "12px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(node.id, node.x, node.y);
    }

    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        context.beginPath();
        context.moveTo(edge.firstNode.x, edge.firstNode.y);
        context.lineTo(edge.secondNode.x, edge.secondNode.y);
        context.stroke();
        if (edge.weight!== null) {
            let midX = (edge.firstNode.x + edge.secondNode.x) / 2;
            let midY = (edge.firstNode.y + edge.secondNode.y) / 2;
            context.font = "12px Arial";
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(edge.weight, midX, midY);
        }
    }
}

function SendData() {
    edge_formatting = [];
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        edge_formatting.push(edge.firstNode.id, edge.secondNode.id, edge.weight);
    }
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
        edges : edge_formatting,
        V : nodes.length
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('MST Edges:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


window.onload = function() {
    setupCanvasEvents();
    document.getElementById("calculate").onclick = SendData;
}

