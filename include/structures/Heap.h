#ifndef HEAP_H
#define HEAP_H

// Fixed-capacity binary heap (max-heap by default, min-heap if constructed with false).
class Heap
{
private:
    int arr[100];
    int count;
    bool maxHeap;

    bool higher(int a, int b);
    void heapifyUp(int index);
    void heapifyDown(int index);

public:
    Heap(bool isMax = true);

    bool insert(int value);
    bool extractTop(int &value);
    int peek();

    bool isEmpty();
    bool isFull();
    int size();

    void display();
};

#endif
