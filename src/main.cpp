#include "../include/structures/AVL.h"
#include <iostream>
using namespace std;

int main()
{
    AVL tree;

    cout << "=== DSA Toolkit - AVL Tree Test ===\n\n";

    tree.insert(30);
    tree.insert(20);
    tree.insert(10);

    tree.insert(40);
    tree.insert(50);

    tree.insert(25);

    cout << "AVL Tree traversals:\n";

    tree.inorder();
    tree.preorder();

    cout << "\nSearching for 25:\n";

    if (tree.search(25))
        cout << "25 found in AVL tree.\n";
    else
        cout << "25 not found.\n";

    cout << "\nSearching for 100:\n";

    if (tree.search(100))
        cout << "100 found in AVL tree.\n";
    else
        cout << "100 not found.\n";

    return 0;
}