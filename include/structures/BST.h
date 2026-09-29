#ifndef BST_H
#define BST_H

class BST
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
    Node* insert(Node* node, int value);
    bool search(Node* node, int value);

    void inorder(Node* node);
    void preorder(Node* node);
    void postorder(Node* node);

public:
    BST();

    void insert(int value);
    bool search(int value);

    void inorder();
    void preorder();
    void postorder();
};

#endif