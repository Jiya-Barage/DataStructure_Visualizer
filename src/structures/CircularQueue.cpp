#include "../../include/structures/CircularQueue.h"
#include <iostream>
using namespace std;

CircularQueue::CircularQueue()
{
    front = 0;
    rear = -1;
    count = 0;
}

void CircularQueue::enqueue(int value)
{
    if (isFull())
    {
        cout << "Circular Queue overflow.\n";
        return;
    }

    rear = (rear + 1) % 100;
    arr[rear] = value;
    count++;
}

void CircularQueue::dequeue()
{
    if (isEmpty())
    {
        cout << "Circular Queue underflow.\n";
        return;
    }

    front = (front + 1) % 100;
    count--;
}

int CircularQueue::peek()
{
    if (isEmpty())
    {
        cout << "Circular Queue is empty.\n";
        return -1;
    }

    return arr[front];
}

bool CircularQueue::isEmpty()
{
    return count == 0;
}

bool CircularQueue::isFull()
{
    return count == 100;
}

void CircularQueue::display()
{
    if (isEmpty())
    {
        cout << "Circular Queue is empty.\n";
        return;
    }

    cout << "Circular Queue: ";

    for (int i = 0; i < count; i++)
    {
        int index = (front + i) % 100;
        cout << arr[index] << " ";
    }

    cout << endl;
}