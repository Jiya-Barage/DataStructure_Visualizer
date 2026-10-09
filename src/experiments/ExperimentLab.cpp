
#include "../../include/experiments/ExperimentLab.h"
#include "../../include/algorithms/Sorting.h"
#include "../../include/metrics/Metrics.h"
#include <iostream>

using namespace std;

void ExperimentLab::compareSortingAlgorithms()
{
    int original[] = {64, 25, 12, 22, 11};
    int size = 5;

    int bubble[5];
    int selection[5];
    int insertion[5];
    int merge[5];
    int quick[5];

    for (int i = 0; i < size; i++)
    {
        bubble[i] = original[i];
        selection[i] = original[i];
        insertion[i] = original[i];
        merge[i] = original[i];
        quick[i] = original[i];
    }

    Metrics metrics;

    cout << "\n========== EXPERIMENT LAB ==========\n";
    cout << "Comparing sorting algorithms on the same input.\n";
    cout << "Original Array: ";

    for (int i = 0; i < size; i++)
        cout << original[i] << " ";

    cout << "\n";

    cout << "\n--- Bubble Sort ---\n";
    Sorting::bubbleSort(bubble, size, &metrics);
    metrics.display();

    cout << "\n--- Selection Sort ---\n";
    Sorting::selectionSort(selection, size, &metrics);
    metrics.display();

    cout << "\n--- Insertion Sort ---\n";
    Sorting::insertionSort(insertion, size, &metrics);
    metrics.display();

    cout << "\n--- Merge Sort ---\n";
    metrics.reset();
    metrics.startTimer();
    Sorting::mergeSort(merge, 0, size - 1, &metrics);
    metrics.stopTimer();
    metrics.display();

    cout << "\n--- Quick Sort ---\n";
    metrics.reset();
    metrics.startTimer();
    Sorting::quickSort(quick, 0, size - 1, &metrics);
    metrics.stopTimer();
    metrics.display();

    cout << "\nAll five algorithms completed.\n";
}