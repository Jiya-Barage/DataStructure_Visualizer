#include "../../include/algorithms/Sorting.h"

void Sorting::bubbleSort(int arr[], int size, Metrics* metrics)
{
    if (metrics != nullptr)
    {
        metrics->reset();
        metrics->startTimer();
    }

    for (int i = 0; i < size - 1; i++)
    {
        for (int j = 0; j < size - i - 1; j++)
        {
            if (metrics != nullptr)
            {
                metrics->incrementComparisons();
                metrics->incrementArrayAccesses();
                metrics->incrementArrayAccesses();
            }

            if (arr[j] > arr[j + 1])
            {
                int temp = arr[j];

                if (metrics != nullptr)
                    metrics->incrementAssignments();

                arr[j] = arr[j + 1];

                if (metrics != nullptr)
                    metrics->incrementAssignments();

                arr[j + 1] = temp;

                if (metrics != nullptr)
                {
                    metrics->incrementAssignments();
                    metrics->incrementSwaps();
                }
            }
        }
    }

    if (metrics != nullptr)
    {
        metrics->stopTimer();
    }
}


void Sorting::selectionSort(int arr[], int size, Metrics* metrics)
{
    if (metrics != nullptr)
    {
        metrics->reset();
        metrics->startTimer();
    }

    for (int i = 0; i < size - 1; i++)
    {
        int minIndex = i;

        if (metrics != nullptr)
            metrics->incrementAssignments();

        for (int j = i + 1; j < size; j++)
        {
            if (metrics != nullptr)
            {
                metrics->incrementComparisons();
                metrics->incrementArrayAccesses();
                metrics->incrementArrayAccesses();
            }

            if (arr[j] < arr[minIndex])
            {
                minIndex = j;

                if (metrics != nullptr)
                    metrics->incrementAssignments();
            }
        }

        if (minIndex != i)
        {
            int temp = arr[i];

            if (metrics != nullptr)
                metrics->incrementAssignments();

            arr[i] = arr[minIndex];

            if (metrics != nullptr)
                metrics->incrementAssignments();

            arr[minIndex] = temp;

            if (metrics != nullptr)
            {
                metrics->incrementAssignments();
                metrics->incrementSwaps();
            }
        }
    }

    if (metrics != nullptr)
    {
        metrics->stopTimer();
    }
}


void Sorting::insertionSort(int arr[], int size, Metrics* metrics)
{
    if (metrics != nullptr)
    {
        metrics->reset();
        metrics->startTimer();
    }

    for (int i = 1; i < size; i++)
    {
        int key = arr[i];
        int j = i - 1;

        if (metrics != nullptr)
        {
            metrics->incrementAssignments();
            metrics->incrementArrayAccesses();
        }

        while (j >= 0)
        {
            if (metrics != nullptr)
            {
                metrics->incrementComparisons();
                metrics->incrementArrayAccesses();
            }

            if (arr[j] <= key)
            {
                break;
            }

            arr[j + 1] = arr[j];

            if (metrics != nullptr)
            {
                metrics->incrementAssignments();
                metrics->incrementArrayAccesses();
            }

            j--;
        }

        arr[j + 1] = key;

        if (metrics != nullptr)
        {
            metrics->incrementAssignments();
        }
    }

    if (metrics != nullptr)
    {
        metrics->stopTimer();
    }
}


void Sorting::merge(int arr[], int left, int mid, int right)
{
    int temp[100];

    int i = left;
    int j = mid + 1;
    int k = left;

    while (i <= mid && j <= right)
    {
        if (arr[i] <= arr[j])
        {
            temp[k] = arr[i];
            i++;
        }
        else
        {
            temp[k] = arr[j];
            j++;
        }

        k++;
    }

    while (i <= mid)
    {
        temp[k] = arr[i];
        i++;
        k++;
    }

    while (j <= right)
    {
        temp[k] = arr[j];
        j++;
        k++;
    }

    for (i = left; i <= right; i++)
    {
        arr[i] = temp[i];
    }
}


void Sorting::mergeSort(int arr[], int left, int right)
{
    if (left >= right)
        return;

    int mid = left + (right - left) / 2;

    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    merge(arr, left, mid, right);
}


int Sorting::partition(int arr[], int low, int high)
{
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++)
    {
        if (arr[j] < pivot)
        {
            i++;

            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
}


void Sorting::quickSort(int arr[], int low, int high)
{
    if (low >= high)
        return;

    int pivotIndex = partition(arr, low, high);

    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
}


void Sorting::heapify(int arr[], int size, int root)
{
    int largest = root;

    int left = 2 * root + 1;
    int right = 2 * root + 2;

    if (left < size && arr[left] > arr[largest])
    {
        largest = left;
    }

    if (right < size && arr[right] > arr[largest])
    {
        largest = right;
    }

    if (largest != root)
    {
        int temp = arr[root];
        arr[root] = arr[largest];
        arr[largest] = temp;

        heapify(arr, size, largest);
    }
}


void Sorting::heapSort(int arr[], int size)
{
    for (int i = size / 2 - 1; i >= 0; i--)
    {
        heapify(arr, size, i);
    }

    for (int i = size - 1; i > 0; i--)
    {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        heapify(arr, i, 0);
    }
}