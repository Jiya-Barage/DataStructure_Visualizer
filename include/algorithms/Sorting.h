#ifndef SORTING_H
#define SORTING_H

#include "../metrics/Metrics.h"

class Sorting
{
public:
    static void bubbleSort(int arr[], int size, Metrics* metrics = nullptr);
    static void selectionSort(int arr[], int size, Metrics* metrics = nullptr);
    static void insertionSort(int arr[], int size, Metrics* metrics = nullptr);

    static void mergeSort(int arr[], int left, int right);
    static void quickSort(int arr[], int low, int high);
    static void heapSort(int arr[], int size);

private:
    static void merge(int arr[], int left, int mid, int right);
    static int partition(int arr[], int low, int high);
    static void heapify(int arr[], int size, int root);
};

#endif