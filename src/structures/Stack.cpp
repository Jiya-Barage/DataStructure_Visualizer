
#include "../../include/structures/Stack.h"
#include <iostream>

using namespace std;

Stack::Stack()
{
    top = -1;
}

bool Stack::push(int value)
{
    if (isFull())
    {
        cout << "Stack overflow.\n";
        return false;
    }

    top++;
    arr[top] = value;
    return true;
}

bool Stack::pop()
{
    if (isEmpty())
    {
        cout << "Stack underflow.\n";
        return false;
    }

    top--;
    return true;
}

int Stack::peek()
{
    if (isEmpty())
    {
        cout << "Stack is empty.\n";
        return -1;
    }

    return arr[top];
}

bool Stack::isEmpty()
{
    return top == -1;
}

bool Stack::isFull()
{
    return top == 99;
}

int Stack::size()
{
    return top + 1;
}

// Returns elements from bottom to top.
int Stack::getElement(int index)
{
    if (index < 0 || index >= size())
        return -1;

    return arr[index];
}

void Stack::display()
{
    if (isEmpty())
    {
        cout << "Stack is empty.\n";
        return;
    }

    cout << "Stack: ";

    for (int i = top; i >= 0; i--)
        cout << arr[i] << " ";

    cout << endl;
}