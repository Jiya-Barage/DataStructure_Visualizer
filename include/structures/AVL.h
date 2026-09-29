#ifndef AVL_H
#define AVL_H

class AVL
{
private:
    struct Node
    {
        int data;
        int height;
        Node* left;
        Node* right;
    };

    Node* root;

    Node* createNode(int value);

    int height(Node* node);
    int getBalance(Node* node);

    Node* rightRotate(Node* node);
    Node* leftRotate(Node* node);

    Node* insert(Node* node, int value);
    bool search(Node* node, int value);

    void inorder(Node* node);
    void preorder(Node* node);

public:
    AVL();

    void insert(int value);
    bool search(int value);

    void inorder();
    void preorder();
};

#endif