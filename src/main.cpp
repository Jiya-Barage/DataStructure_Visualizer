#include "../include/learning/LearningMode.h"
#include "../include/structures/Array.h"
#include "../include/structures/LinkedList.h"
#include "../include/structures/Stack.h"
#include "../include/structures/Queue.h"
#include "../include/structures/CircularQueue.h"
#include "../include/structures/Deque.h"
#include "../include/structures/BinaryTree.h"
#include "../include/structures/BST.h"
#include "../include/structures/AVL.h"
#include "../include/experiments/ExperimentLab.h"
#include "../include/algorithms/Searching.h"
#include "../include/algorithms/Sorting.h"
#include "../include/metrics/Metrics.h"
#include "../include/analysis/ComplexityAnalyzer.h"
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

void runAllDemos()
{
    cout << "==================================================\n";
    cout << "          DSA TOOLKIT & VISUALIZER\n";
    cout << "==================================================\n\n";

    // 1. ARRAY
    cout << "========== 1. ARRAY ==========\n";

    ArrayDS arrayDS;
    arrayDS.insert(10, 0);
    arrayDS.insert(20, 1);
    arrayDS.insert(30, 2);
    arrayDS.insert(15, 1);
    arrayDS.display();

    cout << "Searching for 20: ";
    if (arrayDS.search(20) != -1)
        cout << "Found\n";
    else
        cout << "Not Found\n";

    // 2. LINKED LIST
    cout << "\n========== 2. LINKED LIST ==========\n";

    LinkedList list;
    list.insertEnd(10);
    list.insertEnd(20);
    list.insertBeginning(5);
    list.insertEnd(30);
    list.display();

    cout << "Searching for 20: ";
    if (list.search(20) != -1)
        cout << "Found\n";
    else
        cout << "Not Found\n";

    // 3. STACK
    cout << "\n========== 3. STACK ==========\n";

    Stack stack;
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();


    cout << "Top element: " << stack.peek() << endl;

    stack.pop();
    cout << "After pop: ";
    stack.display();

    cout << "Stack size: " << stack.size() << endl;
    cout << "Bottom element: " << stack.getElement(0) << endl;

    // 4. QUEUE
    cout << "\n========== 4. QUEUE ==========\n";

    Queue queue;
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    queue.display();


    cout << "Front element: " << queue.peek() << endl;

    queue.dequeue();
    cout << "After dequeue: ";
    queue.display();

    cout << "Queue size: " << queue.size() << endl;
    cout << "Front element by index: " << queue.getElement(0) << endl;

    // 5. CIRCULAR QUEUE
    cout << "\n========== 5. CIRCULAR QUEUE ==========\n";

    CircularQueue circularQueue;
    circularQueue.enqueue(10);
    circularQueue.enqueue(20);
    circularQueue.enqueue(30);
    circularQueue.display();

    circularQueue.dequeue();
    circularQueue.enqueue(40);
    circularQueue.enqueue(50);

    cout << "After dequeue + enqueue: ";
    circularQueue.display();

    // 6. DEQUE
    cout << "\n========== 6. DEQUE ==========\n";

    Deque deque;
    deque.insertRear(20);
    deque.insertRear(30);
    deque.insertFront(10);
    deque.display();

    cout << "Front: " << deque.getFront() << endl;
    cout << "Rear: " << deque.getRear() << endl;

    deque.deleteFront();
    cout << "After deleting front: ";
    deque.display();

    // 7. BINARY TREE
    cout << "\n========== 7. BINARY TREE ==========\n";

    BinaryTree binaryTree;
    binaryTree.insert(10);
    binaryTree.insert(5);
    binaryTree.insert(20);
    binaryTree.insert(3);
    binaryTree.insert(7);

    binaryTree.inorder();
    binaryTree.preorder();
    binaryTree.postorder();

    cout << "Searching for 7: ";
    if (binaryTree.search(7))
        cout << "Found\n";
    else
        cout << "Not Found\n";

    // 8. BINARY SEARCH TREE
    cout << "\n========== 8. BINARY SEARCH TREE ==========\n";

    BST bst;
    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    bst.insert(20);
    bst.insert(40);
    bst.insert(60);
    bst.insert(80);

    bst.inorder();
    bst.preorder();
    bst.postorder();

    cout << "Searching for 60: ";
    if (bst.search(60))
        cout << "Found\n";
    else
        cout << "Not Found\n";

    // 9. AVL TREE
    cout << "\n========== 9. AVL TREE ==========\n";

    AVL avl;
    avl.insert(30);
    avl.insert(20);
    avl.insert(10);
    avl.insert(40);
    avl.insert(50);
    avl.insert(25);

    avl.inorder();
    avl.preorder();

    cout << "Searching for 25: ";
    if (avl.search(25))
        cout << "Found\n";
    else
        cout << "Not Found\n";

   
    // ========== 10. SEARCHING ALGORITHMS ==========
    cout << "\n========== 10. SEARCHING ALGORITHMS ==========\n";

    int searchArray[] = {10, 20, 30, 40, 50};
    int searchSize = 5;
    int key = 30;

    cout << "Array: ";
    displayArray(searchArray, searchSize);

    Metrics searchMetrics;

    cout << "\n--- Linear Search ---\n";
    int linearResult = Searching::linearSearch(
        searchArray, searchSize, key, &searchMetrics
    );

    if (linearResult != -1)
        cout << "Found at position: " << linearResult << endl;
    else
        cout << "Element not found\n";

    searchMetrics.display();

    cout << "\n--- Binary Search ---\n";
    int binaryResult = Searching::binarySearch(
        searchArray, searchSize, key, &searchMetrics
    );

    if (binaryResult != -1)
        cout << "Found at position: " << binaryResult << endl;
    else
        cout << "Element not found\n";

    searchMetrics.display();

    // 11. SORTING ALGORITHMS
    cout << "\n========== 11. SORTING ALGORITHMS ==========\n";

    int original[] = {64, 25, 12, 22, 11};
    int size = 5;

    int bubble[] = {64, 25, 12, 22, 11};
    int selection[] = {64, 25, 12, 22, 11};
    int insertion[] = {64, 25, 12, 22, 11};
    int merge[] = {64, 25, 12, 22, 11};
    int quick[] = {64, 25, 12, 22, 11};
    int heap[] = {64, 25, 12, 22, 11};

    cout << "Original Array: ";
    displayArray(original, size);

    Sorting::bubbleSort(bubble, size);
    cout << "Bubble Sort:    ";
    displayArray(bubble, size);

    Sorting::selectionSort(selection, size);
    cout << "Selection Sort: ";
    displayArray(selection, size);

    Sorting::insertionSort(insertion, size);
    cout << "Insertion Sort: ";
    displayArray(insertion, size);

    Sorting::mergeSort(merge, 0, size - 1);
    cout << "Merge Sort:     ";
    displayArray(merge, size);

    Sorting::quickSort(quick, 0, size - 1);
    cout << "Quick Sort:     ";
    displayArray(quick, size);

    Sorting::heapSort(heap, size);
    cout << "Heap Sort:      ";
    displayArray(heap, size);

    // 12. SORTING METRICS
    cout << "\n========== 12. SORTING METRICS ==========\n";

    Metrics metrics;

    cout << "\n--- Bubble Sort ---\n";
    int bubbleMetricsArray[] = {64, 25, 12, 22, 11};

    Sorting::bubbleSort(bubbleMetricsArray, 5, &metrics);

    cout << "Sorted Array: ";
    displayArray(bubbleMetricsArray, 5);
    metrics.display();

    cout << "\n--- Selection Sort ---\n";
    int selectionMetricsArray[] = {64, 25, 12, 22, 11};

    Sorting::selectionSort(selectionMetricsArray, 5, &metrics);

    cout << "Sorted Array: ";
    displayArray(selectionMetricsArray, 5);
    metrics.display();

    cout << "\n--- Insertion Sort ---\n";
    int insertionMetricsArray[] = {64, 25, 12, 22, 11};

    Sorting::insertionSort(insertionMetricsArray, 5, &metrics);

    cout << "Sorted Array: ";
    displayArray(insertionMetricsArray, 5);
    metrics.display();

    cout << "\n--- Merge Sort ---\n";
    int mergeMetricsArray[] = {64, 25, 12, 22, 11};

    metrics.reset();
    metrics.startTimer();

    Sorting::mergeSort(mergeMetricsArray, 0, 4, &metrics);

    metrics.stopTimer();

    cout << "Sorted Array: ";
    displayArray(mergeMetricsArray, 5);
    metrics.display();

    cout << "\n--- Quick Sort ---\n";
    int quickMetricsArray[] = {64, 25, 12, 22, 11};

    metrics.reset();
    metrics.startTimer();

    Sorting::quickSort(quickMetricsArray, 0, 4, &metrics);

    metrics.stopTimer();

    cout << "Sorted Array: ";
    displayArray(quickMetricsArray, 5);
    metrics.display();

    cout << "\n==================================================\n";
    cout << "             DEMONSTRATION COMPLETE\n";
    cout << "==================================================\n";

}


int main()
{
    int choice = -1;

    do
    {
        cout << "\n";
        cout << "============================================\n";
        cout << "         DSA TOOLKIT & VISUALIZER\n";
        cout << "============================================\n";
        cout << "1. Data Structures and Algorithm Demos\n";
        cout << "2. Experiment Lab\n";
        cout << "3. Complexity Analysis\n";
        cout << "4. Learning and Testing Mode\n";
        cout << "0. Exit\n";
        cout << "--------------------------------------------\n";
        cout << "Enter your choice: ";

        cin >> choice;

        if (cin.fail())
        {
            cin.clear();
            cin.ignore(10000, '\n');
            cout << "Invalid input. Please enter a number.\n";
            choice = -1;
            continue;
        }

        switch (choice)
        {
            case 1:
                runAllDemos();
                break;

            case 2:
                ExperimentLab::compareSortingAlgorithms();
                break;

            case 3:
                ComplexityAnalyzer::displayComplexityTable();
                break;

            case 4:
                LearningMode::run();
                break;

            case 0:
                cout << "Thank you for using the DSA Toolkit!\n";
                break;

            default:
                cout << "Invalid choice. Please select 0 to 4.\n";
        }

    } while (choice != 0);

    return 0;
}