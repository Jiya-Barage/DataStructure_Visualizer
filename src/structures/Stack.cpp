#include "../../include/structures/Stack.h"
#include <iostream>
using namespace std;

Stack::Stack()
{
    top = -1;
}

void Stack::push(int value)
{
    if (isFull())
    {
        cout << "Stack overflow.\n";
        return;
    }

    top++;
    arr[top] = value;
}

void Stack::pop()
{
    if (isEmpty())
    {
        cout << "Stack underflow.\n";
        return;
    }

    top--;
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

void Stack::display()
{
    if (isEmpty())
    {
        cout << "Stack is empty.\n";
        return;
    }

    cout << "Stack: ";

    for (int i = top; i >= 0; i--)
    {
        cout << arr[i] << " ";
    }

    cout << endl;
}