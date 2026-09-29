#include "../../include/structures/BinaryTree.h"
#include <iostream>
using namespace std;

BinaryTree::BinaryTree()
{
    root = nullptr;
}

BinaryTree::Node* BinaryTree::createNode(int value)
{
    Node* newNode = new Node;

    newNode->data = value;
    newNode->left = nullptr;
    newNode->right = nullptr;

    return newNode;
}

void BinaryTree::insert(int value)
{
    Node* newNode = createNode(value);

    if (root == nullptr)
    {
        root = newNode;
        return;
    }

    Node* current = root;

    while (true)
    {
        if (current->left == nullptr)
        {
            current->left = newNode;
            return;
        }

        if (current->right == nullptr)
        {
            current->right = newNode;
            return;
        }

        current = current->left;
    }
}

void BinaryTree::inorder(Node* node)
{
    if (node == nullptr)
        return;

    inorder(node->left);
    cout << node->data << " ";
    inorder(node->right);
}

void BinaryTree::preorder(Node* node)
{
    if (node == nullptr)
        return;

    cout << node->data << " ";
    preorder(node->left);
    preorder(node->right);
}

void BinaryTree::postorder(Node* node)
{
    if (node == nullptr)
        return;

    postorder(node->left);
    postorder(node->right);
    cout << node->data << " ";
}

bool BinaryTree::search(Node* node, int value)
{
    if (node == nullptr)
        return false;

    if (node->data == value)
        return true;

    return search(node->left, value) ||
           search(node->right, value);
}

void BinaryTree::inorder()
{
    cout << "Inorder: ";
    inorder(root);
    cout << endl;
}

void BinaryTree::preorder()
{
    cout << "Preorder: ";
    preorder(root);
    cout << endl;
}

void BinaryTree::postorder()
{
    cout << "Postorder: ";
    postorder(root);
    cout << endl;
}

bool BinaryTree::search(int value)
{
    return search(root, value);
}