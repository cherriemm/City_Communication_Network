
class Edge:
    def __init__(self, l, r, val):
        self.l = l
        self.r = r
        self.val = val

"""Disjoint set union for kruskal algorithm"""
class Dsu:

    def __init__(self, V):
        self.parent = list(range(0, V + 1))

    def find(self, u):
        if u == self.parent[u]:
            return u
        else:
            self.parent[u] = self.find(self.parent[u])
            return self.parent[u]

    """judge whether two nodes belong to the same set"""
    def is_same(self, u, v):
        u = self.find(u)
        v = self.find(v)
        return u == v

    """join two set"""
    def join(self, u, v):
        u = self.find(u)
        v = self.find(v)
        self.parent[u] = v


def kruskal_mst(V, edges):
    forest = Dsu(V)
    mst = []
    cost = 0

    edges = sorted(edges, key=lambda edge: edge.val)
    for edge in edges:
        l = edge.l
        r = edge.r
        if not forest.is_same(l, r):
            forest.join(l, r)
            mst.append(edge)
            cost += edge.val

    return mst, cost



if __name__ == "__main__" :
    V = 7
    data = [
        [1, 2, 1],
        [1, 3, 1],
        [1, 5, 2],
        [2, 6, 1],
        [2, 4, 2],
        [2, 3, 2],
        [3, 4, 1],
        [4, 5, 1],
        [5, 6, 2],
        [5, 7, 1],
        [6, 7, 1]
    ]

    e = [Edge(row[0], row[1], row[2]) for row in data]

    path, c = kruskal_mst(V, e)
    print(c)





