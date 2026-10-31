#include "../../include/structures/HashTable.h"
#include <iostream>

using namespace std;

HashTable::HashTable()
{
    count = 0;
    for (int i = 0; i < BUCKETS; i++)
        table[i] = nullptr;
}

HashTable::~HashTable()
{
    for (int i = 0; i < BUCKETS; i++)
    {
        HashNode *current = table[i];
        while (current != nullptr)
        {
            HashNode *next = current->next;
            delete current;
            current = next;
        }
    }
}

int HashTable::hashFunction(int key)
{
    int h = key % BUCKETS;
    return h < 0 ? h + BUCKETS : h;
}

void HashTable::put(int key, int value)
{
    int index = hashFunction(key);

    for (HashNode *cur = table[index]; cur != nullptr; cur = cur->next)
    {
        if (cur->key == key)
        {
            cur->value = value;
            return;
        }
    }

    HashNode *node = new HashNode{key, value, table[index]};
    table[index] = node;
    count++;
}

bool HashTable::get(int key, int &value)
{
    for (HashNode *cur = table[hashFunction(key)]; cur != nullptr; cur = cur->next)
    {
        if (cur->key == key)
        {
            value = cur->value;
            return true;
        }
    }
    return false;
}

bool HashTable::remove(int key)
{
    int index = hashFunction(key);
    HashNode *prev = nullptr;
    HashNode *cur = table[index];

    while (cur != nullptr)
    {
        if (cur->key == key)
        {
            if (prev == nullptr)
                table[index] = cur->next;
            else
                prev->next = cur->next;
            delete cur;
            count--;
            return true;
        }
        prev = cur;
        cur = cur->next;
    }
    return false;
}

int HashTable::size() { return count; }

double HashTable::loadFactor()
{
    return (double)count / BUCKETS;
}

void HashTable::display()
{
    for (int i = 0; i < BUCKETS; i++)
    {
        cout << "[" << i << "] ";
        for (HashNode *cur = table[i]; cur != nullptr; cur = cur->next)
            cout << "(" << cur->key << ":" << cur->value << ") -> ";
        cout << "NULL\n";
    }
    cout << "Load factor: " << loadFactor() << endl;
}
