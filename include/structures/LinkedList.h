#ifndef LINKED_LIST_H
#define LINKED_LIST_H

class LinkedList
{
private:
    struct Node
    {
        int data;
        Node* next;
    };

    Node* head;

public:
    LinkedList();

    void insertBeginning(int value);
    void insertEnd(int value);
    void remove(int value);
    int search(int value);
    void display();
};

#endif