#include "../include/structures/Array.h"
#include "../include/structures/LinkedList.h"
#include "../include/structures/Stack.h"
#include "../include/structures/Queue.h"
#include "../include/structures/CircularQueue.h"
#include "../include/structures/Deque.h"
#include "../include/structures/BinaryTree.h"
#include "../include/structures/BST.h"
#include "../include/structures/AVL.h"

#include "../include/algorithms/Searching.h"
#include "../include/algorithms/Sorting.h"

#include "../include/metrics/Metrics.h"

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
    cout << "==================================================\n";
    cout << "          DSA TOOLKIT & VISUALIZER\n";
    cout << "==================================================\n\n";


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


    cout << "\n========== 10. SEARCHING ALGORITHMS ==========\n";

    int searchArray[] = {10, 20, 30, 40, 50};
    int searchSize = 5;
    int key = 30;

    cout << "Array: ";
    displayArray(searchArray, searchSize);


    int linearResult =
        Searching::linearSearch(searchArray, searchSize, key);

    cout << "Linear Search for " << key << ": ";

    if (linearResult != -1)
        cout << "Found at position " << linearResult << endl;
    else
        cout << "Not Found\n";


    int binaryResult =
        Searching::binarySearch(searchArray, searchSize, key);

    cout << "Binary Search for " << key << ": ";

    if (binaryResult != -1)
        cout << "Found at position " << binaryResult << endl;
    else
        cout << "Not Found\n";


    cout << "\n========== 11. SORTING ALGORITHMS ==========\n";

    int original[] = {64, 25, 12, 22, 11};

    int size = 5;

    int bubble[5] =
        {64, 25, 12, 22, 11};

    int selection[5] =
        {64, 25, 12, 22, 11};

    int insertion[5] =
        {64, 25, 12, 22, 11};

    int merge[5] =
        {64, 25, 12, 22, 11};

    int quick[5] =
        {64, 25, 12, 22, 11};

    int heap[5] =
        {64, 25, 12, 22, 11};


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

cout << "\n========== 12. BUBBLE SORT METRICS ==========\n";

int metricsArray[] = {64, 25, 12, 22, 11};

Metrics metrics;

Sorting::bubbleSort(metricsArray, 5, &metrics);

cout << "Sorted Array: ";
displayArray(metricsArray, 5);

metrics.display();
}