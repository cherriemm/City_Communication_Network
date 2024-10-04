from flask import Flask, render_template, request, jsonify
from mst import kruskal_mst
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap4
import click
from graph_store import db, Node, Edge, add_graph


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] ='sqlite:///graph.db'
db.init_app(app)
bootstrap = Bootstrap4(app)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate_mst():
    data = request.get_json()
    edges = data.get('edges')
    v = data.get('V')
    new_edges = [{'l': edge[0], 'r':edge[1], 'val': edge[2]} for edge in edges]
    mst_edges, cost = kruskal_mst(v, new_edges)

    return jsonify(mst_edges)



@app.route('/save_to_database', methods=['POST'])
def save_to_database():
    data = request.get_json()
    edges = data.get('edges')
    nodes = data.get('nodes')
    graphName = data.get('graphName')
    graphDescription = data.get('graphDescription')

    message = add_graph(nodes, edges, graphName, graphDescription)
    if message == 'success':
        return jsonify({'message': 'Data saved successfully'})
    else:
        return jsonify({'error': str(message)}), 500



@app.cli.command()  
@click.option('--drop', is_flag=True, help='Create after drop.')  
def initdb(drop):
    """Initialize the database."""
    if drop:  
        db.drop_all()
    db.create_all()
    click.echo('Initialized database.')  


if __name__ == '__main__':
    app.run(debug=True)
