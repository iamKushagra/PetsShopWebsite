void levelorder(Node* root)
{

if (root == NULL) return;
 Node* t = root;
 queue <Node*> q;
 
  q.push(root);
  while(q.size() > 1)
  {
  t = q.front();
  q.pop();
  if (t == NULL) 
        { 
           q.push(NULL); 
           cout << "\n"; 
        } 
        else{  std::cout << t->data <<" ";
    if(t->left)
  q.push(t->left);
  if(t->right)
  q.push(t->right);}
          

 }
 
}

int main() {
  int arr[] = { 1, 2, 3, 4, 5, 6, 6, 6, 6 }; 
    int n = sizeof(arr)/sizeof(arr[0]); 
    Node* root = insert(arr, root, 0, n); 
    levelorder(root);
}