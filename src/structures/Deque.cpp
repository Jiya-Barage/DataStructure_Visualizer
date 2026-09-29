#include "../../include/structures/Deque.h"
#include <iostream>
using namespace std;

Deque::Deque()
{
    front = 0;
    rear = -1;
    count = 0;
}

void Deque::insertFront(int value)
{
    if (isFull())
    {
        cout << "Deque overflow.\n";
        return;
    }

    if (isEmpty())
    {
        front = 0;
        rear = 0;
    }
    else
    {
        front = (front - 1 + 100) % 100;
    }

    arr[front] = value;
    count++;
}

void Deque::insertRear(int value)
{
    if (isFull())
    {
        cout << "Deque overflow.\n";
        return;
    }

    if (isEmpty())
    {
        front = 0;
        rear = 0;
    }
    else
    {
        rear = (rear + 1) % 100;
    }

    arr[rear] = value;
    count++;
}

void Deque::deleteFront()
{
    if (isEmpty())
    {
        cout << "Deque underflow.\n";
        return;
    }

    if (count == 1)
    {
        front = 0;
        rear = -1;
    }
    else
    {
        front = (front + 1) % 100;
    }

    count--;
}

void Deque::deleteRear()
{
    if (isEmpty())
    {
        cout << "Deque underflow.\n";
        return;
    }

    if (count == 1)
    {
        front = 0;
        rear = -1;
    }
    else
    {
        rear = (rear - 1 + 100) % 100;
    }

    count--;
}

int Deque::getFront()
{
    if (isEmpty())
    {
        cout << "Deque is empty.\n";
        return -1;
    }

    return arr[front];
}

int Deque::getRear()
{
    if (isEmpty())
    {
        cout << "Deque is empty.\n";
        return -1;
    }

    return arr[rear];
}

bool Deque::isEmpty()
{
    return count == 0;
}

bool Deque::isFull()
{
    return count == 100;
}

void Deque::display()
{
    if (isEmpty())
    {
        cout << "Deque is empty.\n";
        return;
    }

    cout << "Deque: ";

    for (int i = 0; i < count; i++)
    {
        int index = (front + i) % 100;
        cout << arr[index] << " ";
    }

    cout << endl;
}
