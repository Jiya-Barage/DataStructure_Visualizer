#include "../../include/metrics/Metrics.h"
#include <iostream>

using namespace std;

Metrics::Metrics()
{
    reset();
}

void Metrics::reset()
{
    comparisons = 0;
    swaps = 0;
    assignments = 0;
    arrayAccesses = 0;
    recursiveCalls = 0;
}

void Metrics::incrementComparisons()
{
    comparisons++;
}

void Metrics::incrementSwaps()
{
    swaps++;
}

void Metrics::incrementAssignments()
{
    assignments++;
}

void Metrics::incrementArrayAccesses()
{
    arrayAccesses++;
}

void Metrics::incrementRecursiveCalls()
{
    recursiveCalls++;
}

long long Metrics::getComparisons()
{
    return comparisons;
}

long long Metrics::getSwaps()
{
    return swaps;
}

long long Metrics::getAssignments()
{
    return assignments;
}

long long Metrics::getArrayAccesses()
{
    return arrayAccesses;
}

long long Metrics::getRecursiveCalls()
{
    return recursiveCalls;
}

void Metrics::display()
{
    cout << "------------------------------\n";
    cout << "           METRICS\n";
    cout << "------------------------------\n";

    cout << "Comparisons     : " << comparisons << endl;
    cout << "Swaps           : " << swaps << endl;
    cout << "Assignments     : " << assignments << endl;
    cout << "Array Accesses  : " << arrayAccesses << endl;
    cout << "Recursive Calls : " << recursiveCalls << endl;

    cout << "------------------------------\n";
}