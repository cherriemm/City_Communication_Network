from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///graph.db'
db = SQLAlchemy(app)

class Node(db.Model):
    __tablename__ = 'node'
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    name = db.Column(db.String(20))
    graph_id = db.Column(db.Integer, db.ForeignKey('graph.id'))


class Edge(db.Model):
    __tablename__ = 'edge'
    id = db.Column(db.Integer, primary_key=True)
    first_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    second_node_id = db.Column(db.Integer, db.ForeignKey('node.id'))
    weight = db.Column(db.Integer)
    graph_id = db.Column(db.Integer, db.ForeignKey('graph.id'))

    first_node = db.relationship('Node', foreign_keys= [first_node_id])
    second_node = db.relationship('Node', foreign_keys=[second_node_id])



class Graph(db.Model):
    __tablename__ = 'graph'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.Text)

    nodes = db.relationship('Node', backref='graph', lazy=True)
    edges = db.relationship('Edge', backref='graph', lazy=True)


def add_graph(nodes, edges, graphName, graphDescription):
    session = db.session
    new_graph = Graph(name=graphName, description=graphDescription)
    session.add(new_graph)
    session.commit()
    graph_id = new_graph.id

    try:
        for node in nodes:
            new_node = Node(x=node['x'], y=node['y'], name=node['id'], graph_id=graph_id)
            session.add(new_node)
        session.commit()

        for edge in edges:
            first_node_name = edge['firstNode']['id']
            second_node_name = edge['secondNode']['id']
            weight = edge['weight']

            first_node = Node.query.filter_by(name = first_node_name).first()
            if first_node is None:
                print(f"Error: Node with name {first_node_name} not found.")
            

            second_node = Node.query.filter_by(name = second_node_name).first()
            if second_node is None:
                print(f"Error: Node with name {second_node_name} not found.")

            new_edge = Edge(first_node_id=first_node.id, second_node_id=second_node.id, weight=weight, graph_id=graph_id)
            session.add(new_edge)
        session.commit()
        return 'success'
    except Exception as e:
        session.rollback()
        return str(e)
    finally:
        session.close()