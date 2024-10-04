var nodes = [];
var edges = [];
var r = 20;

var add_city = false;
var add_edge = false;
var add_weight = false;
var modify_city_name = false;

var firstNode = null;
var secondNode = null;

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function AddCity(event) {
    var canvas = document.getElementById('cityNetwork');
    var pos = getMousePos(canvas, event);
    var x = pos.x;
    var y = pos.y;
    var id = nodes.length + 1;
    nodes.push({x, y, id});
    console.log(id);
    draw();
}

function AddEdge(event) {
    var canvas = document.getElementById('cityNetwork');
    var pos = getMousePos(canvas, event);
    var clickedNode = null;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let dx = pos.x - node.x;
        let dy = pos.y - node.y;
        if (dx * dx + dy * dy <= r * r) {
            clickedNode = node;
            break;
        }
    }
    if (clickedNode !== null) {
        if (firstNode === null) {
            firstNode = clickedNode;
        } else {
            secondNode = clickedNode;
            if (secondNode === firstNode) {
                firstNode = null;
                secondNode = null;
                return;
            }
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
    var canvas = document.getElementById('cityNetwork');
    var pos = getMousePos(canvas, event);
    var clickedEdge = null;
    if (in_circle(event)) return;
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let x1 = edge.firstNode.x, x2 = edge.secondNode.x;
        let y1 = edge.firstNode.y, y2 = edge.secondNode.y;
        
        let A = y2 - y1, B = x1 - x2, C = x2 * y1 - x1 * y2;
        let distance = Math.abs(A * pos.x + B * pos.y + C) / Math.sqrt(A * A + B * B);

        if (distance <= 10) {
            clickedEdge = edge;
            break;
        }
    }
    var weight = prompt('请输入边的权重');
    if (weight !== null && clickedEdge !== null) {
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

function formatting_graph() {
    edge_formatting = [];
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        edge_formatting.push([edge.firstNode.id, edge.secondNode.id, edge.weight]);
    }
    return edge_formatting;
}


function SendData() {
    var edge_formatting = formatting_graph();
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


function storeGraph() {
    console.log(nodes);
    console.log(edges);
    var graphName = document.getElementById('graphName').value;
    var graphDescription = document.getElementById('graphDescription').value;
    fetch('/save_to_database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
        edges : edges,
        nodes : nodes,
        graphName: graphName,
        graphDescription: graphDescription
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function LoadGraph() {

}

window.onload = function() {
    setupCanvasEvents();
    document.getElementById("calculate").onclick = SendData;
    document.getElementById("store").onclick = function(event) {
        $('#storeModal').modal('show');
    };
    document.getElementById("load").onclick = LoadGraph;
    document.getElementById('submit').addEventListener('click', function (event) {
        storeGraph();
        $('#storeModal').modal('hide');
    });
}

