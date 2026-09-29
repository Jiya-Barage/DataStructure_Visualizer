#ifndef STACK_H
#define STACK_H

class Stack
{
private:
    int arr[100];
    int top;

public:
    Stack();

    void push(int value);
    void pop();
    int peek();
    bool isEmpty();
    bool isFull();
    void display();
};

#endif