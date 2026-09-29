#include "../../include/structures/Queue.h"
#include <iostream>
using namespace std;

Queue::Queue()
{
    front = 0;
    rear = -1;
}

void Queue::enqueue(int value)
{
    if (isFull())
    {
        cout << "Queue overflow.\n";
        return;
    }

    rear++;
    arr[rear] = value;
}

void Queue::dequeue()
{
    if (isEmpty())
    {
        cout << "Queue underflow.\n";
        return;
    }

    front++;
}

int Queue::peek()
{
    if (isEmpty())
    {
        cout << "Queue is empty.\n";
        return -1;
    }

    return arr[front];
}

bool Queue::isEmpty()
{
    return front > rear;
}

bool Queue::isFull()
{
    return rear == 99;
}

void Queue::display()
{
    if (isEmpty())
    {
        cout << "Queue is empty.\n";
        return;
    }

    cout << "Queue: ";

    for (int i = front; i <= rear; i++)
    {
        cout << arr[i] << " ";
    }

    cout << endl;
}