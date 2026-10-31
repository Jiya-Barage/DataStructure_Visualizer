// Build: g++ -std=c++17 tests/test_new_structures.cpp src/structures/Heap.cpp src/structures/HashTable.cpp src/algorithms/Graph.cpp -o tests/test_new
#include "../include/structures/Heap.h"
#include "../include/structures/HashTable.h"
#include "../include/algorithms/Graph.h"
#include <iostream>
using namespace std;

static int failures = 0;
#define CHECK(cond) do { if (!(cond)) { cout << "FAIL line " << __LINE__ << ": " #cond "\n"; failures++; } } while (0)

int main()
{
    Heap mx(true), mn(false);
    int vals[] = {5, 3, 17, 10, 84, 19, 6, 22, 9};
    for (int v : vals) { mx.insert(v); mn.insert(v); }
    int out, prev = 1 << 30;
    while (mx.extractTop(out)) { CHECK(out <= prev); prev = out; }
    prev = -(1 << 30);
    while (mn.extractTop(out)) { CHECK(out >= prev); prev = out; }

    HashTable ht;
    for (int k = 0; k < 30; k++) ht.put(k, k * 10);
    ht.put(7, 999);
    CHECK(ht.size() == 30);
    CHECK(ht.get(7, out) && out == 999);
    CHECK(ht.remove(7) && !ht.get(7, out) && ht.size() == 29);
    CHECK(!ht.remove(1000));
    ht.put(-5, 1);
    CHECK(ht.get(-5, out) && out == 1);

    Graph g(5);
    g.addEdge(0, 1, 4); g.addEdge(0, 2, 1); g.addEdge(2, 1, 2); g.addEdge(1, 3, 1);
    CHECK(g.hasCycle());
    Graph tree(4);
    tree.addEdge(0, 1); tree.addEdge(1, 2); tree.addEdge(1, 3);
    CHECK(!tree.hasCycle());
    Graph dag(3, true);
    dag.addEdge(0, 1); dag.addEdge(1, 2); dag.addEdge(0, 2);
    CHECK(!dag.hasCycle());
    dag.addEdge(2, 0);
    CHECK(dag.hasCycle());
    g.bfs(0); g.dfs(0); g.shortestPaths(0);

    cout << (failures ? "TESTS FAILED\n" : "ALL TESTS PASSED\n");
    return failures;
}
