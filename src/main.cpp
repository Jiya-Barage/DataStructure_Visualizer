#include "../include/algorithms/Sorting.h"
#include <iostream>
using namespace std;

void displayArray(int arr[], int size)
{
    for (int i = 0; i < size; i++)
    {
        cout << arr[i] << " ";
    }

    cout << endl;
}

int main()
{
    cout << "=== DSA Toolkit - Sorting Test ===\n\n";

    int original[] = {64, 25, 12, 22, 11};
    int size = 5;

    int arr1[5] = {64, 25, 12, 22, 11};
    int arr2[5] = {64, 25, 12, 22, 11};
    int arr3[5] = {64, 25, 12, 22, 11};
    int arr4[5] = {64, 25, 12, 22, 11};
    int arr5[5] = {64, 25, 12, 22, 11};
    int arr6[5] = {64, 25, 12, 22, 11};

    cout << "Original Array: ";
    displayArray(original, size);

    Sorting::bubbleSort(arr1, size);
    cout << "Bubble Sort:    ";
    displayArray(arr1, size);

    Sorting::selectionSort(arr2, size);
    cout << "Selection Sort: ";
    displayArray(arr2, size);

    Sorting::insertionSort(arr3, size);
    cout << "Insertion Sort: ";
    displayArray(arr3, size);

    Sorting::mergeSort(arr4, 0, size - 1);
    cout << "Merge Sort:     ";
    displayArray(arr4, size);

    Sorting::quickSort(arr5, 0, size - 1);
    cout << "Quick Sort:     ";
    displayArray(arr5, size);

    Sorting::heapSort(arr6, size);
    cout << "Heap Sort:      ";
    displayArray(arr6, size);

    return 0;
}