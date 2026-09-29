#include "../../include/structures/AVL.h"
#include <iostream>
using namespace std;

AVL::AVL()
{
    root = nullptr;
}

AVL::Node* AVL::createNode(int value)
{
    Node* newNode = new Node;

    newNode->data = value;
    newNode->height = 1;
    newNode->left = nullptr;
    newNode->right = nullptr;

    return newNode;
}

int AVL::height(Node* node)
{
    if (node == nullptr)
        return 0;

    return node->height;
}

int AVL::getBalance(Node* node)
{
    if (node == nullptr)
        return 0;

    return height(node->left) - height(node->right);
}

AVL::Node* AVL::rightRotate(Node* node)
{
    Node* leftChild = node->left;
    Node* temp = leftChild->right;

    leftChild->right = node;
    node->left = temp;

    node->height = 1 +
        max(height(node->left), height(node->right));

    leftChild->height = 1 +
        max(height(leftChild->left), height(leftChild->right));

    return leftChild;
}

AVL::Node* AVL::leftRotate(Node* node)
{
    Node* rightChild = node->right;
    Node* temp = rightChild->left;

    rightChild->left = node;
    node->right = temp;

    node->height = 1 +
        max(height(node->left), height(node->right));

    rightChild->height = 1 +
        max(height(rightChild->left), height(rightChild->right));

    return rightChild;
}

AVL::Node* AVL::insert(Node* node, int value)
{
    if (node == nullptr)
        return createNode(value);

    if (value < node->data)
    {
        node->left = insert(node->left, value);
    }
    else if (value > node->data)
    {
        node->right = insert(node->right, value);
    }
    else
    {
        return node;
    }

    node->height = 1 +
        max(height(node->left), height(node->right));

    int balance = getBalance(node);

    // Left Left case
    if (balance > 1 && value < node->left->data)
        return rightRotate(node);

    // Right Right case
    if (balance < -1 && value > node->right->data)
        return leftRotate(node);

    // Left Right case
    if (balance > 1 && value > node->left->data)
    {
        node->left = leftRotate(node->left);
        return rightRotate(node);
    }

    // Right Left case
    if (balance < -1 && value < node->right->data)
    {
        node->right = rightRotate(node->right);
        return leftRotate(node);
    }

    return node;
}

void AVL::insert(int value)
{
    root = insert(root, value);
}

bool AVL::search(Node* node, int value)
{
    if (node == nullptr)
        return false;

    if (node->data == value)
        return true;

    if (value < node->data)
        return search(node->left, value);

    return search(node->right, value);
}

bool AVL::search(int value)
{
    return search(root, value);
}

void AVL::inorder(Node* node)
{
    if (node == nullptr)
        return;

    inorder(node->left);
    cout << node->data << " ";
    inorder(node->right);
}

void AVL::preorder(Node* node)
{
    if (node == nullptr)
        return;

    cout << node->data << " ";
    preorder(node->left);
    preorder(node->right);
}

void AVL::inorder()
{
    cout << "Inorder: ";
    inorder(root);
    cout << endl;
}

void AVL::preorder()
{
    cout << "Preorder: ";
    preorder(root);
    cout << endl;
}