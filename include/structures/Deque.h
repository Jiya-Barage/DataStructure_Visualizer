#ifndef DEQUE_H
#define DEQUE_H

class Deque
{
private:
    int arr[100];
    int front;
    int rear;
    int count;

public:
    Deque();

    void insertFront(int value);
    void insertRear(int value);

    void deleteFront();
    void deleteRear();

    int getFront();
    int getRear();

    bool isEmpty();
    bool isFull();

    void display();
};

#endif