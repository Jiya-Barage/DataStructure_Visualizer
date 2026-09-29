#ifndef BINARY_TREE_H
#define BINARY_TREE_H

class BinaryTree
{
private:
    struct Node
    {
        int data;
        Node* left;
        Node* right;
    };

    Node* root;

    Node* createNode(int value);
    void inorder(Node* node);
    void preorder(Node* node);
    void postorder(Node* node);
    bool search(Node* node, int value);

public:
    BinaryTree();

    void insert(int value);
    void inorder();
    void preorder();
    void postorder();
    bool search(int value);
};

#endif