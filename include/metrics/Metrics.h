#ifndef METRICS_H
#define METRICS_H

#include <chrono>

class Metrics
{
private:
    long long comparisons;
    long long swaps;
    long long assignments;
    long long arrayAccesses;
    long long recursiveCalls;
    long long executionTime;

    std::chrono::high_resolution_clock::time_point start;

public:
    Metrics();

    void reset();

    void incrementComparisons();
    void incrementSwaps();
    void incrementAssignments();
    void incrementArrayAccesses();
    void incrementRecursiveCalls();

    void startTimer();
    void stopTimer();

    long long getComparisons();
    long long getSwaps();
    long long getAssignments();
    long long getArrayAccesses();
    long long getRecursiveCalls();
    long long getExecutionTime();

    void display();
};

#endif