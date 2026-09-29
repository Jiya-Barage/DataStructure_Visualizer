#include "../include/structures/BST.h"
#include <iostream>
using namespace std;

int main()
{
    BST tree;

    cout << "=== DSA Toolkit - BST Test ===\n\n";

    tree.insert(50);
    tree.insert(30);
    tree.insert(70);
    tree.insert(20);
    tree.insert(40);
    tree.insert(60);
    tree.insert(80);

    cout << "Tree traversals:\n";

    tree.inorder();
    tree.preorder();
    tree.postorder();

    cout << "\nSearching for 60:\n";

    if (tree.search(60))
        cout << "60 found in BST.\n";
    else
        cout << "60 not found in BST.\n";

    cout << "\nSearching for 90:\n";

    if (tree.search(90))
        cout << "90 found in BST.\n";
    else
        cout << "90 not found in BST.\n";

    return 0;
}