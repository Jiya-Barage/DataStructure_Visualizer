
#include "../../include/analysis/ComplexityAnalyzer.h"
#include <iostream>
#include <iomanip>
#include <string>

using namespace std;

void ComplexityAnalyzer::displayComplexityTable()
{
    cout << "\n========== COMPLEXITY ANALYSIS ==========\n";

    cout << left
         << setw(19) << "Algorithm"
         << setw(17) << "Best Case"
         << setw(17) << "Average Case"
         << setw(17) << "Worst Case"
         << "Auxiliary Space\n";

    cout << string(90, '-') << "\n";

    cout << left
         << setw(19) << "Linear Search"
         << setw(17) << "O(1)"
         << setw(17) << "O(n)"
         << setw(17) << "O(n)"
         << "O(1)\n";

    cout << left
         << setw(19) << "Binary Search"
         << setw(17) << "O(1)"
         << setw(17) << "O(log n)"
         << setw(17) << "O(log n)"
         << "O(1)\n";

    cout << left
         << setw(19) << "Bubble Sort"
         << setw(17) << "O(n^2)"
         << setw(17) << "O(n^2)"
         << setw(17) << "O(n^2)"
         << "O(1)\n";

    cout << left
         << setw(19) << "Selection Sort"
         << setw(17) << "O(n^2)"
         << setw(17) << "O(n^2)"
         << setw(17) << "O(n^2)"
         << "O(1)\n";

    cout << left
         << setw(19) << "Insertion Sort"
         << setw(17) << "O(n)"
         << setw(17) << "O(n^2)"
         << setw(17) << "O(n^2)"
         << "O(1)\n";

    cout << left
         << setw(19) << "Merge Sort"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n log n)"
         << "O(n)\n";

    cout << left
         << setw(19) << "Quick Sort"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n^2)"
         << "O(log n) average\n";

    cout << left
         << setw(19) << "Heap Sort"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n log n)"
         << setw(17) << "O(n log n)"
         << "O(1)\n";

    cout << string(90, '-') << "\n";
    cout << "Note: Binary Search requires sorted input.\n";
    cout << "Quick Sort can use O(n) auxiliary stack space in the worst case.\n";
    cout << "Bubble Sort here has no early-exit optimization.\n";
}