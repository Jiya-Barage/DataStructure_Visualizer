#include "../../include/structures/BST.h"
#include <iostream>
using namespace std;

BST::BST()
{
    root = nullptr;
}

BST::Node* BST::createNode(int value)
{
    Node* newNode = new Node;

    newNode->data = value;
    newNode->left = nullptr;
    newNode->right = nullptr;

    return newNode;
}

BST::Node* BST::insert(Node* node, int value)
{
    if (node == nullptr)
    {
        return createNode(value);
    }

    if (value < node->data)
    {
        node->left = insert(node->left, value);
    }
    else if (value > node->data)
    {
        node->right = insert(node->right, value);
    }

    return node;
}

void BST::insert(int value)
{
    root = insert(root, value);
}

bool BST::search(Node* node, int value)
{
    if (node == nullptr)
    {
        return false;
    }

    if (node->data == value)
    {
        return true;
    }

    if (value < node->data)
    {
        return search(node->left, value);
    }

    return search(node->right, value);
}

bool BST::search(int value)
{
    return search(root, value);
}

void BST::inorder(Node* node)
{
    if (node == nullptr)
    {
        return;
    }

    inorder(node->left);
    cout << node->data << " ";
    inorder(node->right);
}

void BST::preorder(Node* node)
{
    if (node == nullptr)
    {
        return;
    }

    cout << node->data << " ";
    preorder(node->left);
    preorder(node->right);
}

void BST::postorder(Node* node)
{
    if (node == nullptr)
    {
        return;
    }

    postorder(node->left);
    postorder(node->right);
    cout << node->data << " ";
}

void BST::inorder()
{
    cout << "Inorder: ";
    inorder(root);
    cout << endl;
}

void BST::preorder()
{
    cout << "Preorder: ";
    preorder(root);
    cout << endl;
}

void BST::postorder()
{
    cout << "Postorder: ";
    postorder(root);
    cout << endl;
}