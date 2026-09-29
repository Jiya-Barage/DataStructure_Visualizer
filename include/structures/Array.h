#ifndef ARRAY_H
#define ARRAY_H

class ArrayDS
{
private:
    int arr[100];
    int size;

public:
    ArrayDS();

    void insert(int value, int position);
    void remove(int position);
    int search(int value);
    void display();
    int getSize();
};

#endif