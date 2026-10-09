
#ifndef SEARCHING_H
#define SEARCHING_H

#include "../metrics/Metrics.h"

class Searching
{
public:
    static int linearSearch(int arr[], int size, int key, Metrics* metrics = nullptr);
    static int binarySearch(int arr[], int size, int key, Metrics* metrics = nullptr);
};

#endif