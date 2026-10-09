
#include "../../include/algorithms/Searching.h"

int Searching::linearSearch(int arr[], int size, int key, Metrics* metrics)
{
    if (metrics != nullptr)
    {
        metrics->reset();
        metrics->startTimer();
    }

    for (int i = 0; i < size; i++)
    {
        if (metrics != nullptr)
        {
            metrics->incrementComparisons();
            metrics->incrementArrayAccesses();
        }

        if (arr[i] == key)
        {
            if (metrics != nullptr)
                metrics->stopTimer();

            return i;
        }
    }

    if (metrics != nullptr)
        metrics->stopTimer();

    return -1;
}

int Searching::binarySearch(int arr[], int size, int key, Metrics* metrics)
{
    if (metrics != nullptr)
    {
        metrics->reset();
        metrics->startTimer();
    }

    int low = 0;
    int high = size - 1;

    while (low <= high)
    {
        int mid = low + (high - low) / 2;

        if (metrics != nullptr)
        {
            metrics->incrementArrayAccesses();
            metrics->incrementComparisons();
        }

        if (arr[mid] == key)
        {
            if (metrics != nullptr)
                metrics->stopTimer();

            return mid;
        }

        if (metrics != nullptr)
            metrics->incrementComparisons();

        if (arr[mid] < key)
        {
            low = mid + 1;
        }
        else
        {
            high = mid - 1;
        }
    }

    if (metrics != nullptr)
        metrics->stopTimer();

    return -1;
}