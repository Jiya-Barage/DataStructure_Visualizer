
#ifndef QUEUE_H
#define QUEUE_H

class Queue
{
private:
    int arr[100];
    int front;
    int rear;

public:
    Queue();

    bool enqueue(int value);
    bool dequeue();
    int peek();

    bool isEmpty();
    bool isFull();

    int size();
    int getElement(int index);

    void display();
};

#endif