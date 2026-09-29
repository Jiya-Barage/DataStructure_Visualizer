#include "../../include/structures/Array.h"
#include <iostream>
using namespace std;

ArrayDS::ArrayDS()
{
    size = 0;
}

void ArrayDS::insert(int value, int position)
{
    if (size >= 100 || position < 0 || position > size)
    {
        cout << "Invalid insertion.\n";
        return;
    }

    for (int i = size; i > position; i--)
    {
        arr[i] = arr[i - 1];
    }

    arr[position] = value;
    size++;
}

void ArrayDS::remove(int position)
{
    if (position < 0 || position >= size)
    {
        cout << "Invalid deletion.\n";
        return;
    }

    for (int i = position; i < size - 1; i++)
    {
        arr[i] = arr[i + 1];
    }

    size--;
}

int ArrayDS::search(int value)
{
    for (int i = 0; i < size; i++)
    {
        if (arr[i] == value)
        {
            return i;
        }
    }

    return -1;
}

void ArrayDS::display()
{
    cout << "Array: ";

    for (int i = 0; i < size; i++)
    {
        cout << arr[i] << " ";
    }

    cout << endl;
}

int ArrayDS::getSize()
{
    return size;
}