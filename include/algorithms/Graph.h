#ifndef GRAPH_H
#define GRAPH_H

// Weighted graph stored as an adjacency list of hand-written nodes.
struct EdgeNode
{
    int to;
    int weight;
    EdgeNode *next;
};

class Graph
{
private:
    static const int MAX_VERTICES = 20;
    EdgeNode *adj[MAX_VERTICES];
    int vertices;
    bool directed;

public:
    Graph(int v, bool isDirected = false);
    ~Graph();

    bool addEdge(int from, int to, int weight = 1);
    void display();

    void bfs(int start);
    void dfs(int start);
    void dfsVisit(int node, bool visited[]);

    // Dijkstra shortest paths (non-negative weights); prints distance to every vertex.
    void shortestPaths(int source);
    bool hasCycle();
};

#endif
