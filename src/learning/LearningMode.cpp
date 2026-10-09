
#include "../../include/learning/LearningMode.h"
#include <iostream>
#include <string>

using namespace std;

struct QuizQuestion
{
    string question;
    string options[4];
    char answer;
    string explanation;
};

void LearningMode::run()
{
    QuizQuestion easy[5] =
    {
        {
            "What is the index of the first element in a normal C++ array?",
            {"A. 1", "B. 0", "C. -1", "D.  Depends on the array"},
            'B',
            "C++ arrays use zero-based indexing."
        },
        {
            "What is the worst-case time complexity of Linear Search?",
            {"A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n^2)"},
            'C',
            "Linear Search may need to examine every element."
        },
        {
            "What does Binary Search require?",
            {"A. Sorted data", "B. An empty array", "C. A stack", "D. Unsorted data"},
            'A',
            "Binary Search works by repeatedly dividing a sorted search range."
        },
        {
            "Which principle does a stack follow?",
            {"A. FIFO", "B. Random order", "C. LIFO", "D. Sorted order"},
            'C',
            "LIFO means Last In, First Out."
        },
        {
            "Which principle does a queue follow?",
            {"A. LIFO", "B. FIFO", "C. Highest value first", "D. Lowest value first"},
            'B',
            "FIFO means First In, First Out."
        }
    };

    QuizQuestion intermediate[5] =
    {
        {
            "What is the worst-case time complexity of Merge Sort?",
            {"A. O(n)", "B. O(n^2)", "C. O(log n)", "D. O(n log n)"},
            'D',
            "Merge Sort divides the array and merges sorted sections in O(n log n) time."
        },
        {
            "How many element comparisons does Selection Sort make for 5 elements?",
            {"A. 5", "B. 10", "C. 15", "D. 25"},
            'B',
            "It makes 5*4/2 = 10 comparisons."
        },
        {
            "What is the time complexity of accessing the i-th node in a singly linked list?",
            {"A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n log n)"},
            'C',
            "The list may need to be traversed from its first node."
        },
        {
            "What is the search complexity of a balanced Binary Search Tree?",
            {"A. O(1)", "B. O(log n)", "C. O(n^2)", "D. O(n log n)"},
            'B',
            "A balanced tree reduces the search space at each level."
        },
        {
            "What is the worst-case time complexity of Quick Sort?",
            {"A. O(n)", "B. O(log n)", "C. O(n log n)", "D. O(n^2)"},
            'D',
            "Poor pivot choices can cause highly unbalanced partitions."
        }
    };

    QuizQuestion advanced[5] =
    {
        {
            "Which recurrence describes the running time of Merge Sort?",
            {"A. T(n) = T(n-1) + O(1)",
             "B. T(n) = 2T(n/2) + O(n)",
             "C. T(n) = T(n/2) + O(1)",
             "D. T(n) = nT(n-1)"},
            'B',
            "Merge Sort solves two half-sized problems and merges them in linear time."
        },
        {
            "What causes Quick Sort to reach O(n^2) worst-case time?",
            {"A. Always balanced partitions",
             "B. Sorted output",
             "C. Repeatedly highly unbalanced partitions",
             "D. Using an array"},
            'C',
            "Highly unbalanced partitions can lead to quadratic work."
        },
        {
            "Which balance factors are allowed for an AVL tree node?",
            {"A. Only 0", "B. -1, 0, and +1", "C. -2 to +2", "D. Any integer"},
            'B',
            "An AVL tree keeps the height difference between its subtrees within one."
        },
        {
            "If low = 2 and high = 8, what is mid using low + (high-low)/2?",
            {"A. 4", "B. 5", "C. 6", "D. 10"},
            'B',
            "mid = 2 + (8-2)/2 = 5."
        },
        {
            "Which algorithm is generally unsuitable for graphs with negative edge weights?",
            {"A. BFS", "B. DFS", "C. Dijkstra's algorithm", "D. Linear Search"},
            'C',
            "Dijkstra's algorithm assumes non-negative edge weights for its standard correctness guarantee."
        }
    };

    int level;

    cout << "\n========== LEARNING & TESTING MODE ==========\n";
    cout << "Choose your difficulty level:\n";
    cout << "1. Easy\n";
    cout << "2. Intermediate\n";
    cout << "3. Advanced\n";
    cout << "0. Exit to main program\n";
    cout << "Your choice: ";

    cin >> level;

    if (cin.fail())
    {
        cin.clear();
        cin.ignore(10000, '\n');
        cout << "Invalid input. Returning to the main program.\n";
        return;
    }

    if (level == 0)
    {
        cout << "Exiting Learning Mode.\n";
        return;
    }

    QuizQuestion* selectedQuestions = nullptr;
    string levelName;

    if (level == 1)
    {
        selectedQuestions = easy;
        levelName = "Easy";
    }
    else if (level == 2)
    {
        selectedQuestions = intermediate;
        levelName = "Intermediate";
    }
    else if (level == 3)
    {
        selectedQuestions = advanced;
        levelName = "Advanced";
    }
    else
    {
        cout << "Invalid level. Returning to the main program.\n";
        return;
    }

    int score = 0;
    char choice;

    cout << "\nStarting " << levelName << " Quiz!\n";
    cout << "There are 5 questions. Enter A, B, C, or D.\n";

    for (int i = 0; i < 5; i++)
    {
        cout << "\nQuestion " << i + 1 << ": "
             << selectedQuestions[i].question << "\n";

        for (int j = 0; j < 4; j++)
            cout << selectedQuestions[i].options[j] << "\n";

        cout << "Your answer: ";
        cin >> choice;

        if (choice >= 'a' && choice <= 'z')
            choice = choice - 'a' + 'A';

        if (choice == selectedQuestions[i].answer)
        {
            cout << "Correct!\n";
            score++;
        }
        else
        {
            cout << "Incorrect. Correct answer: "
                 << selectedQuestions[i].answer << "\n";
        }

        cout << "Explanation: "
             << selectedQuestions[i].explanation << "\n";
    }

    cout << "\n========== QUIZ RESULTS ==========\n";
    cout << "Difficulty: " << levelName << "\n";
    cout << "Your score: " << score << " / 5\n";

    if (score == 5)
        cout << "Excellent! All answers correct.\n";
    else if (score >= 3)
        cout << "Good work! Review any topics you missed.\n";
    else
        cout << "Keep practising. Review the explanations and try again.\n";

    cout << "==================================\n";
}