#include "../include/structures/LinkedList.h"
#include <iostream>
using namespace std;

int main()
{
    LinkedList list;

    cout << "=== DSA Toolkit - Linked List Test ===\n\n";

    list.insertEnd(10);
    list.insertEnd(20);
    list.insertEnd(30);

    cout << "After inserting at end:\n";
    list.display();

    list.insertBeginning(5);

    cout << "\nAfter inserting 5 at beginning:\n";
    list.display();

    int position = list.search(20);

    cout << "\nSearching for 20:\n";

    if (position != -1)
        cout << "20 found at position " << position << endl;
    else
        cout << "20 not found.\n";

    list.remove(20);

    cout << "\nAfter deleting 20:\n";
    list.display();

    return 0;
}