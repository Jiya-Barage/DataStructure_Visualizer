#include "../include/structures/Array.h"
#include <iostream>
using namespace std;

int main()
{
    ArrayDS arr;

    cout << "=== DSA Toolkit - Array Test ===\n\n";

    // Insert elements
    arr.insert(10, 0);
    arr.insert(20, 1);
    arr.insert(30, 2);

    cout << "After insertion:\n";
    arr.display();

    // Insert in the middle
    arr.insert(15, 1);

    cout << "\nAfter inserting 15 at position 1:\n";
    arr.display();

    // Search
    int position = arr.search(20);

    cout << "\nSearching for 20:\n";

    if (position != -1)
        cout << "20 found at position " << position << endl;
    else
        cout << "20 not found.\n";

    // Delete
    arr.remove(2);

    cout << "\nAfter deleting element at position 2:\n";
    arr.display();

    // Size
    cout << "\nCurrent size: " << arr.getSize() << endl;

    return 0;
}