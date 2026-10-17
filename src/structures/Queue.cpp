
#include "../../include/structures/Queue.h"
#include <iostream>

using namespace std;

Queue::Queue()
{
    front = 0;
    rear = -1;
}

bool Queue::enqueue(int value)
{
    if (isFull())
    {
        cout << "Queue overflow.\n";
        return false;
    }

    rear++;
    arr[rear] = value;
    return true;
}

bool Queue::dequeue()
{
    if (isEmpty())
    {
        cout << "Queue underflow.\n";
        return false;
    }

    front++;

    if (front > rear)
    {
        front = 0;
        rear = -1;
    }

    return true;
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

int Queue::size()
{
    if (isEmpty())
        return 0;

    return rear - front + 1;
}

// Returns elements in front-to-rear order.
int Queue::getElement(int index)
{
    if (index < 0 || index >= size())
        return -1;

    return arr[front + index];
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
        cout << arr[i] << " ";

    cout << endl;
}