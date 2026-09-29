#include "../include/structures/Queue.h"
#include <iostream>
using namespace std;

int main()
{
    Queue queue;

    cout << "=== DSA Toolkit - Queue Test ===\n\n";

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

    return 0;
}