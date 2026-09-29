#include "../include/structures/BinaryTree.h"
#include <iostream>
using namespace std;

int main()
{
    BinaryTree tree;

    cout << "=== DSA Toolkit - Binary Tree Test ===\n\n";

    tree.insert(10);
    tree.insert(5);
    tree.insert(20);
    tree.insert(3);
    tree.insert(7);

    cout << "Tree traversals:\n";

    tree.inorder();
    tree.preorder();
    tree.postorder();

    cout << "\nSearching for 7:\n";

    if (tree.search(7))
        cout << "7 found in the tree.\n";
    else
        cout << "7 not found in the tree.\n";

    cout << "\nSearching for 50:\n";

    if (tree.search(50))
        cout << "50 found in the tree.\n";
    else
        cout << "50 not found in the tree.\n";

    return 0;
}