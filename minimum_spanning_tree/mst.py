
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


class KruskalMst:
    def __init__(self, E, V, edges):
        self.E = E
        self.V = V
        self.forest = Dsu(V)
        self.join_forest(edges)

    def join_forest(self, edges):
        self.mst = []
        edges = sorted(edges, key=lambda edge: edge.val)
        for edge in edges:
            l = edge.l
            r = edge.r
            if not self.forest.is_same(l, r):
                self.forest.join(l, r)
                self.mst.append(edge)





e = [
    Edge(0, 1, 10),
    Edge(0, 2, 6),
    Edge(0, 3, 5),
    Edge(1, 3, 15),
    Edge(2, 3, 4)
]
V = 4  # 顶点数量
E = len(e)  # 边的数量

kruskal = KruskalMst(E, V, e)

# 输出最小生成树的边
for edge in kruskal.mst:
    print(f"Edge: {edge.l} - {edge.r}, Weight: {edge.val}")
