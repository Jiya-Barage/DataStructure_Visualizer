
#ifndef STACK_H
#define STACK_H

class Stack
{
private:
    int arr[100];
    int top;

public:
    Stack();

    bool push(int value);
    bool pop();
    int peek();

    bool isEmpty();
    bool isFull();

    int size();
    int getElement(int index);

    void display();
};

#endif