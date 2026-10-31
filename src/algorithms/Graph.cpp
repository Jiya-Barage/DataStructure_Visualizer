#include "../../include/algorithms/Graph.h"
#include <iostream>

using namespace std;

Graph::Graph(int v, bool isDirected)
{
    vertices = (v > MAX_VERTICES) ? MAX_VERTICES : (v < 1 ? 1 : v);
    directed = isDirected;
    for (int i = 0; i < MAX_VERTICES; i++)
        adj[i] = nullptr;
}

Graph::~Graph()
{
    for (int i = 0; i < vertices; i++)
    {
        EdgeNode *cur = adj[i];
        while (cur != nullptr)
        {
            EdgeNode *next = cur->next;
            delete cur;
            cur = next;
        }
    }
}

bool Graph::addEdge(int from, int to, int weight)
{
    if (from < 0 || from >= vertices || to < 0 || to >= vertices)
    {
        cout << "Invalid vertex.\n";
        return false;
    }

    adj[from] = new EdgeNode{to, weight, adj[from]};
    if (!directed)
        adj[to] = new EdgeNode{from, weight, adj[to]};
    return true;
}

void Graph::display()
{
    for (int i = 0; i < vertices; i++)
    {
        cout << i << " -> ";
        for (EdgeNode *cur = adj[i]; cur != nullptr; cur = cur->next)
            cout << cur->to << "(w=" << cur->weight << ") ";
        cout << endl;
    }
}

void Graph::bfs(int start)
{
    if (start < 0 || start >= vertices)
        return;

    bool visited[MAX_VERTICES] = {false};
    int queue[MAX_VERTICES];
    int front = 0, rear = 0;

    visited[start] = true;
    queue[rear++] = start;
    cout << "BFS: ";

    while (front < rear)
    {
        int node = queue[front++];
        cout << node << " ";
        for (EdgeNode *cur = adj[node]; cur != nullptr; cur = cur->next)
        {
            if (!visited[cur->to])
            {
                visited[cur->to] = true;
                queue[rear++] = cur->to;
            }
        }
    }
    cout << endl;
}

void Graph::dfsVisit(int node, bool visited[])
{
    visited[node] = true;
    cout << node << " ";
    for (EdgeNode *cur = adj[node]; cur != nullptr; cur = cur->next)
        if (!visited[cur->to])
            dfsVisit(cur->to, visited);
}

void Graph::dfs(int start)
{
    if (start < 0 || start >= vertices)
        return;

    bool visited[MAX_VERTICES] = {false};
    cout << "DFS: ";
    dfsVisit(start, visited);
    cout << endl;
}

void Graph::shortestPaths(int source)
{
    if (source < 0 || source >= vertices)
        return;

    const int INF = 1000000000;
    int dist[MAX_VERTICES];
    bool done[MAX_VERTICES];
    for (int i = 0; i < vertices; i++)
    {
        dist[i] = INF;
        done[i] = false;
    }
    dist[source] = 0;

    for (int step = 0; step < vertices; step++)
    {
        int u = -1;
        for (int i = 0; i < vertices; i++)
            if (!done[i] && (u == -1 || dist[i] < dist[u]))
                u = i;
        if (u == -1 || dist[u] == INF)
            break;

        done[u] = true;
        for (EdgeNode *cur = adj[u]; cur != nullptr; cur = cur->next)
            if (dist[u] + cur->weight < dist[cur->to])
                dist[cur->to] = dist[u] + cur->weight;
    }

    cout << "Shortest distances from " << source << ":\n";
    for (int i = 0; i < vertices; i++)
    {
        cout << "  to " << i << ": ";
        if (dist[i] == INF)
            cout << "unreachable\n";
        else
            cout << dist[i] << endl;
    }
}

static bool cycleVisit(EdgeNode *adj[], int node, int parent, bool directed, bool visited[], bool onStack[])
{
    visited[node] = true;
    onStack[node] = true;

    for (EdgeNode *cur = adj[node]; cur != nullptr; cur = cur->next)
    {
        if (!visited[cur->to])
        {
            if (cycleVisit(adj, cur->to, node, directed, visited, onStack))
                return true;
        }
        else if (directed ? onStack[cur->to] : cur->to != parent)
        {
            return true;
        }
    }

    onStack[node] = false;
    return false;
}

bool Graph::hasCycle()
{
    bool visited[MAX_VERTICES] = {false};
    bool onStack[MAX_VERTICES] = {false};

    for (int i = 0; i < vertices; i++)
        if (!visited[i] && cycleVisit(adj, i, -1, directed, visited, onStack))
            return true;
    return false;
}
