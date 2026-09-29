#include "../include/structures/CircularQueue.h"
#include <iostream>
using namespace std;

int main()
{
    CircularQueue queue;

    cout << "=== DSA Toolkit - Circular Queue Test ===\n\n";

    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    cout << "After enqueueing 10, 20, 30:\n";
    queue.display();

    cout << "\nFront element: " << queue.peek() << endl;

    queue.dequeue();

    cout << "\nAfter dequeue:\n";
    queue.display();

    cout << "\nFront element: " << queue.peek() << endl;

    queue.enqueue(40);
    queue.enqueue(50);

    cout << "\nAfter enqueueing 40 and 50:\n";
    queue.display();

    return 0;
}