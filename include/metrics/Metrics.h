#ifndef METRICS_H
#define METRICS_H

class Metrics
{
private:
    long long comparisons;
    long long swaps;
    long long assignments;
    long long arrayAccesses;
    long long recursiveCalls;

public:
    Metrics();

    void reset();

    void incrementComparisons();
    void incrementSwaps();
    void incrementAssignments();
    void incrementArrayAccesses();
    void incrementRecursiveCalls();

    long long getComparisons();
    long long getSwaps();
    long long getAssignments();
    long long getArrayAccesses();
    long long getRecursiveCalls();

    void display();
};

#endif