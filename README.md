# DataStructure_Visualizer
DS Course project 
# DSA Toolkit & Visualizer

A from-scratch C++ toolkit for implementing, testing, and experimentally comparing fundamental data structures and algorithms.

## 📌 Project Overview

**DSA Toolkit & Visualizer** is a C++ based educational toolkit designed to help students understand Data Structures and Algorithms through implementation, experimentation, and performance comparison.


---

## 🎯 Objectives

* Implement fundamental data structures from scratch.
* Implement important searching and sorting algorithms.
* Provide a common platform for testing different algorithms.
* Compare algorithms using measurable performance metrics.
* Support different types of input datasets.
* Provide an interactive learning and experimentation environment.
* Develop the project in a modular and extensible architecture.

---

## 🧱 Data Structures Implemented

### Linear Data Structures

* Array
* Singly Linked List
* Stack
* Queue
* Circular Queue
* Deque

### Non-Linear Data Structures

* Binary Tree
* Binary Search Tree (BST)
* AVL Tree

### Also Implemented

* Binary Heap (min / max)
* Hash Table (separate chaining)
* Graph (adjacency list) with BFS, DFS, Dijkstra shortest paths and cycle detection

---

## 🔍 Searching Algorithms

Currently implemented:

* Linear Search
* Binary Search

---

## 🔄 Sorting Algorithms

Currently implemented:

* Bubble Sort
* Selection Sort
* Insertion Sort
* Merge Sort
* Quick Sort
* Heap Sort

---

## 📊 Experimental Analysis

A major goal of the project is to go beyond simply displaying algorithm implementations.

The toolkit is being designed to experimentally compare algorithms using metrics such as:

* Number of comparisons
* Number of swaps
* Number of assignments
* Array accesses
* Recursive calls
* Execution time

Different input datasets will also be used for experimentation, including:

* Random data
* Sorted data
* Reverse-sorted data
* Nearly-sorted data
* Duplicate-heavy data

---

## 💡 Key Features

### 1. From-Scratch Implementation

Core data structures and algorithms are implemented manually using:

* Raw arrays
* Pointers
* Dynamic nodes
* Recursion
* Fundamental C++ programming techniques

### 2. Algorithm Experimentation

Instead of only showing how an algorithm works, the project aims to allow users to experimentally observe how different algorithms behave on different datasets.

### 3. Performance Comparison

Algorithms can be compared using measurable operation counts and execution time.

### 4. Learning-Oriented Design

The toolkit is intended to support students in understanding:

* How algorithms operate
* How data structures behave
* Why algorithms have different complexities
* How input characteristics affect performance


## 🏗️ Project Architecture


DSA Toolkit & Visualizer
│
├── Input Module
│   └── Dataset / User Input
│
├── Processing Module
│   ├── Searching Algorithms
│   ├── Sorting Algorithms
│   └── Data Structure Operations
│
├── Storage Module
│   └── Data Structures
│
└── Output Module
    ├── Results
    ├── Performance Metrics
    └── Experimental Comparisons
```

---

## 📁 Project Structure

```text
DS CP/
│
├── include/
│   ├── algorithms/
│   │   ├── Searching.h
│   │   └── Sorting.h
│   │
│   ├── metrics/
│   ├── structures/
│   │
│   └── visualization/
│
├── src/
│   ├── algorithms/
│   │   ├── Graph.cpp
│   │   ├── Searching.cpp
│   │   └── Sorting.cpp
│   │
│   ├── metrics/
│   │   └── Metrics.cpp
│   │
│   ├── structures/
│   │   ├── Array.cpp
│   │   ├── AVL.cpp
│   │   ├── BinaryTree.cpp
│   │   ├── BST.cpp
│   │   ├── CircularQueue.cpp
│   │   ├── Deque.cpp
│   │   ├── HashTable.cpp
│   │   ├── Heap.cpp
│   │   ├── LinkedList.cpp
│   │   ├── Queue.cpp
│   │   └── Stack.cpp
│   │
│   ├── visualization/
│   │   └── Visualizer.cpp
│   │
│   └── main.cpp
│
├── tests/
├── .gitignore
└── README.md
```

---

## 🛠️ Technologies Used

* **Language:** C++
* **Compiler:** GCC / G++
* **Development Environment:** Visual Studio Code
* **Version Control:** Git & GitHub

---

## ▶️ How to Compile

From the project root:

```bash
g++ -std=c++17 src/main.cpp src/*/*.cpp -o main
```

Run the unit checks for Heap / Hash Table / Graph:

```bash
g++ -std=c++17 tests/test_new_structures.cpp src/structures/Heap.cpp src/structures/HashTable.cpp src/algorithms/Graph.cpp -o tests/test_new
./tests/test_new
```

### Web visualizer (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

The web app opens in **light mode by default**; the toggle in the top bar switches to dark and your choice is remembered.
Pages: Stack, Queue, Sorting, Searching, Linked List, Binary Search Tree (with animated traversals) and an Experiment Lab that compares all six sorting algorithms on five dataset types.

Run:

### Windows

```powershell
.\main
```

Individual modules can also be compiled and tested independently during development.

---

## 📈 Current Development Status

### Completed

* [x] Project structure
* [x] Array
* [x] Singly Linked List
* [x] Stack
* [x] Queue
* [x] Circular Queue
* [x] Deque
* [x] Binary Tree
* [x] Binary Search Tree
* [x] AVL Tree
* [x] Linear Search
* [x] Binary Search
* [x] Bubble Sort
* [x] Selection Sort
* [x] Insertion Sort
* [x] Merge Sort
* [x] Quick Sort
* [x] Heap Sort

### Also Completed

* [x] Performance Metrics Engine
* [x] Experimental Comparison Module
* [x] Dataset Generation
* [x] Graph Algorithms
* [x] Heap Data Structure
* [x] Hash Table
* [x] Visualization Module
* [x] Prediction / Interactive Learning Mode

---

## 🚀 Future Scope

The project can be extended into a complete DSA experimentation and learning platform with:

* Interactive algorithm visualization
* Step-by-step execution
* Dataset generation and customization
* Automated algorithm benchmarking
* Performance comparison tables
* Prediction mode where students predict algorithm operations before execution
* Graph algorithm visualization
* Complexity analysis
* Experiment history and result comparison
* Additional data structures and algorithms

---

## 👥 Team

**Group 15**

* Shivani Bankar
* Jiya Barage
* Sadhana Belhekar
* Bhakti Patil

---

## 📚 Academic Context

This project is developed as part of the Data Structure-II course and focuses on applying fundamental concepts of:

* Data Structures
* Algorithms
* Recursion
* Pointers
* Dynamic Memory
* Algorithm Analysis
* Experimental Performance Comparison
* Modular C++ Programming
