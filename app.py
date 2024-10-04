from flask import Flask, render_template, request, jsonify
from mst import kruskal_mst
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_mst():
    data = request.get_json()
    edges = data.get('edges')
    v = data.get('V')
    print(v)
    print(edges)
    mst_edges = kruskal_mst(v, edges)  # 你需要实现这个函数
    return jsonify(mst_edges)

if __name__ == '__main__':
    app.run(debug=True)
