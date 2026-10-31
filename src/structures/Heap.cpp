#include "../../include/structures/Heap.h"
#include <iostream>

using namespace std;

Heap::Heap(bool isMax)
{
    count = 0;
    maxHeap = isMax;
}

bool Heap::higher(int a, int b)
{
    return maxHeap ? a > b : a < b;
}

void Heap::heapifyUp(int index)
{
    while (index > 0)
    {
        int parent = (index - 1) / 2;
        if (!higher(arr[index], arr[parent]))
            break;

        int temp = arr[index];
        arr[index] = arr[parent];
        arr[parent] = temp;
        index = parent;
    }
}

void Heap::heapifyDown(int index)
{
    while (true)
    {
        int best = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        if (left < count && higher(arr[left], arr[best]))
            best = left;
        if (right < count && higher(arr[right], arr[best]))
            best = right;
        if (best == index)
            break;

        int temp = arr[index];
        arr[index] = arr[best];
        arr[best] = temp;
        index = best;
    }
}

bool Heap::insert(int value)
{
    if (isFull())
    {
        cout << "Heap overflow.\n";
        return false;
    }

    arr[count] = value;
    heapifyUp(count);
    count++;
    return true;
}

bool Heap::extractTop(int &value)
{
    if (isEmpty())
    {
        cout << "Heap underflow.\n";
        return false;
    }

    value = arr[0];
    count--;
    arr[0] = arr[count];
    heapifyDown(0);
    return true;
}

int Heap::peek()
{
    if (isEmpty())
    {
        cout << "Heap is empty.\n";
        return -1;
    }
    return arr[0];
}

bool Heap::isEmpty() { return count == 0; }
bool Heap::isFull() { return count == 100; }
int Heap::size() { return count; }

void Heap::display()
{
    cout << (maxHeap ? "Max" : "Min") << "-Heap (array form): ";
    for (int i = 0; i < count; i++)
        cout << arr[i] << " ";
    cout << endl;
}
