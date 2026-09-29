#ifndef CIRCULAR_QUEUE_H
#define CIRCULAR_QUEUE_H

class CircularQueue
{
private:
    int arr[100];
    int front;
    int rear;
    int count;

public:
    CircularQueue();

    void enqueue(int value);
    void dequeue();
    int peek();
    bool isEmpty();
    bool isFull();
    void display();
};

#endif