const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const nodes = [];
const edges = [];

        // 处理鼠标点击，添加节点或边
canvas.addEventListener('click', function(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    // 检查是否选中节点或添加新的节点
    nodes.push({ x, y });
    draw();
});

        // 绘制节点和边
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            edges.forEach(edge => {
                const { from, to, weight } = edge;
                ctx.beginPath();
                ctx.moveTo(nodes[from].x, nodes[from].y);
                ctx.lineTo(nodes[to].x, nodes[to].y);
                ctx.stroke();
                ctx.fillText(weight, (nodes[from].x + nodes[to].x) / 2, (nodes[from].y + nodes[to].y) / 2);
            });
            nodes.forEach(node => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        document.getElementById('calculate').onclick = function() {
            fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ edges }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('MST Edges:', data);
                // 可以在这里更新图形以显示最小生成树
            });
        };

        document.getElementById('add').onclick = function() {

        }