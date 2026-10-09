
#include "../../include/experiments/ExperimentLab.h"
#include "../../include/algorithms/Sorting.h"
#include "../../include/metrics/Metrics.h"
#include <iostream>
#include <iomanip>

using namespace std;

void ExperimentLab::compareSortingAlgorithms()
{
    int original[100];
    int arrays[5][100];
    int size;

    long long comparisons[5];
    long long swaps[5];
    long long assignments[5];
    long long accesses[5];
    long long recursiveCalls[5];
    long long times[5];

    const char* names[5] =
    {
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
        "Merge Sort",
        "Quick Sort"
    };

    cout << "\n========== EXPERIMENT LAB ==========\n";
    cout << "Enter number of elements (1-100): ";
    cin >> size;

    if (cin.fail() || size < 1 || size > 100)
    {
        cout << "Invalid size. Enter a number from 1 to 100.\n";
        return;
    }

    cout << "Enter " << size << " integers:\n";

    for (int i = 0; i < size; i++)
    {
        cin >> original[i];

        if (cin.fail())
        {
            cout << "Invalid input. Enter integers only.\n";
            return;
        }
    }

    for (int a = 0; a < 5; a++)
    {
        for (int i = 0; i < size; i++)
            arrays[a][i] = original[i];
    }

    Metrics metrics;

    Sorting::bubbleSort(arrays[0], size, &metrics);
    comparisons[0] = metrics.getComparisons();
    swaps[0] = metrics.getSwaps();
    assignments[0] = metrics.getAssignments();
    accesses[0] = metrics.getArrayAccesses();
    recursiveCalls[0] = metrics.getRecursiveCalls();
    times[0] = metrics.getExecutionTime();

    Sorting::selectionSort(arrays[1], size, &metrics);
    comparisons[1] = metrics.getComparisons();
    swaps[1] = metrics.getSwaps();
    assignments[1] = metrics.getAssignments();
    accesses[1] = metrics.getArrayAccesses();
    recursiveCalls[1] = metrics.getRecursiveCalls();
    times[1] = metrics.getExecutionTime();

    Sorting::insertionSort(arrays[2], size, &metrics);
    comparisons[2] = metrics.getComparisons();
    swaps[2] = metrics.getSwaps();
    assignments[2] = metrics.getAssignments();
    accesses[2] = metrics.getArrayAccesses();
    recursiveCalls[2] = metrics.getRecursiveCalls();
    times[2] = metrics.getExecutionTime();

    metrics.reset();
    metrics.startTimer();
    Sorting::mergeSort(arrays[3], 0, size - 1, &metrics);
    metrics.stopTimer();
    comparisons[3] = metrics.getComparisons();
    swaps[3] = metrics.getSwaps();
    assignments[3] = metrics.getAssignments();
    accesses[3] = metrics.getArrayAccesses();
    recursiveCalls[3] = metrics.getRecursiveCalls();
    times[3] = metrics.getExecutionTime();

    metrics.reset();
    metrics.startTimer();
    Sorting::quickSort(arrays[4], 0, size - 1, &metrics);
    metrics.stopTimer();
    comparisons[4] = metrics.getComparisons();
    swaps[4] = metrics.getSwaps();
    assignments[4] = metrics.getAssignments();
    accesses[4] = metrics.getArrayAccesses();
    recursiveCalls[4] = metrics.getRecursiveCalls();
    times[4] = metrics.getExecutionTime();

    cout << "\nOriginal Array: ";
    for (int i = 0; i < size; i++)
        cout << original[i] << " ";
    cout << "\n";

    cout << "\n========== COMPARISON SUMMARY ==========\n";

    cout << left
         << setw(16) << "Algorithm"
         << setw(13) << "Comparisons"
         << setw(9) << "Swaps"
         << setw(13) << "Assignments"
         << setw(10) << "Accesses"
         << setw(11) << "Rec.Calls"
         << "Time (ns)\n";

    cout << string(82, '-') << "\n";

    for (int i = 0; i < 5; i++)
    {
        cout << left
             << setw(16) << names[i]
             << setw(13) << comparisons[i]
             << setw(9) << swaps[i]
             << setw(13) << assignments[i]
             << setw(10) << accesses[i]
             << setw(11) << recursiveCalls[i]
             << times[i] << "\n";
    }

    cout << "\n========== SORTED RESULTS ==========\n";

    for (int a = 0; a < 5; a++)
    {
        cout << names[a] << ": ";

        for (int i = 0; i < size; i++)
            cout << arrays[a][i] << " ";

        cout << "\n";
    }

    cout << "\nExperiment completed!\n";
}