
#include "../../include/structures/LinkedList.h"
#include <iostream>

using namespace std;

LinkedList::LinkedList()
{
    head = nullptr;
}

LinkedList::~LinkedList()
{
    Node* current = head;

    while (current != nullptr)
    {
        Node* temp = current;
        current = current->next;
        delete temp;
    }

    head = nullptr;
}

void LinkedList::insertBeginning(int value)
{
    Node* newNode = new Node;

    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

void LinkedList::insertEnd(int value)
{
    Node* newNode = new Node;

    newNode->data = value;
    newNode->next = nullptr;

    if (head == nullptr)
    {
        head = newNode;
        return;
    }

    Node* current = head;

    while (current->next != nullptr)
    {
        current = current->next;
    }

    current->next = newNode;
}

void LinkedList::remove(int value)
{
    if (head == nullptr)
    {
        cout << "List is empty.\n";
        return;
    }

    if (head->data == value)
    {
        Node* temp = head;
        head = head->next;
        delete temp;
        return;
    }

    Node* current = head;

    while (current->next != nullptr &&
           current->next->data != value)
    {
        current = current->next;
    }

    if (current->next == nullptr)
    {
        cout << "Value not found.\n";
        return;
    }

    Node* temp = current->next;
    current->next = temp->next;
    delete temp;
}

int LinkedList::search(int value)
{
    Node* current = head;
    int position = 0;

    while (current != nullptr)
    {
        if (current->data == value)
        {
            return position;
        }

        current = current->next;
        position++;
    }

    return -1;
}

int LinkedList::size()
{
    int count = 0;
    Node* current = head;

    while (current != nullptr)
    {
        count++;
        current = current->next;
    }

    return count;
}

bool LinkedList::getElement(int index, int& value)
{
    if (index < 0)
    {
        return false;
    }

    Node* current = head;

    for (int i = 0; i < index; i++)
    {
        if (current == nullptr)
        {
            return false;
        }

        current = current->next;
    }

    if (current == nullptr)
    {
        return false;
    }

    value = current->data;
    return true;
}

void LinkedList::display()
{
    cout << "Linked List: ";

    Node* current = head;

    while (current != nullptr)
    {
        cout << current->data << " -> ";
        current = current->next;
    }

    cout << "NULL\n";
}
