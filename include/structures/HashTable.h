#ifndef HASHTABLE_H
#define HASHTABLE_H

// Hash table using separate chaining with hand-written linked-list buckets.
struct HashNode
{
    int key;
    int value;
    HashNode *next;
};

class HashTable
{
private:
    static const int BUCKETS = 11;
    HashNode *table[BUCKETS];
    int count;

    int hashFunction(int key);

public:
    HashTable();
    ~HashTable();

    void put(int key, int value);      // inserts or updates
    bool get(int key, int &value);
    bool remove(int key);

    int size();
    double loadFactor();
    void display();
};

#endif
