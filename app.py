from flask import Flask, render_template, request, jsonify
import networkx as nx

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_mst():
    data = request.json
    G = nx.Graph()
    G.add_weighted_edges_from(data['edges'])  # 传入边的数据
    mst = nx.minimum_spanning_tree(G)
    mst_edges = list(mst.edges(data=True))
    return jsonify(mst_edges)

if __name__ == '__main__':
    app.run(debug=True)
