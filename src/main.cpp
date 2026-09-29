#include "../include/structures/Deque.h"
#include <iostream>
using namespace std;

int main()
{
    Deque deque;

    cout << "=== DSA Toolkit - Deque Test ===\n\n";

    deque.insertRear(20);
    deque.insertRear(30);

    cout << "After inserting 20 and 30 at rear:\n";
    deque.display();

    deque.insertFront(10);

    cout << "\nAfter inserting 10 at front:\n";
    deque.display();

    cout << "\nFront element: " << deque.getFront() << endl;
    cout << "Rear element: " << deque.getRear() << endl;

    deque.deleteFront();

    cout << "\nAfter deleting from front:\n";
    deque.display();

    deque.deleteRear();

    cout << "\nAfter deleting from rear:\n";
    deque.display();

    cout << "\nFront element: " << deque.getFront() << endl;
    cout << "Rear element: " << deque.getRear() << endl;

    return 0;
}