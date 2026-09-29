#include "../include/structures/Stack.h"
#include <iostream>
using namespace std;

int main()
{
    Stack stack;

    cout << "=== DSA Toolkit - Stack Test ===\n\n";

    stack.push(10);
    stack.push(20);
    stack.push(30);

    cout << "After pushing 10, 20, 30:\n";
    stack.display();

    cout << "\nTop element: " << stack.peek() << endl;

    stack.pop();

    cout << "\nAfter popping:\n";
    stack.display();

    cout << "\nTop element: " << stack.peek() << endl;

    return 0;
}