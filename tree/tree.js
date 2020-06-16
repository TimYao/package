// 实现二叉搜索树，提供比较器，树的遍历（先序，中序，后序，层次）
// 翻转左右子树
function bst() {
  // 树节点
  class Node {
    constructor(el, parent) {
      this.el = el;
      this.left = null;
      this.right = null;
      this.parent = parent;
    }
  }

  class CreateTree {
    constructor({compare = null, visitor = null} = {}) {
      this.root = null;
      this.size = 0;
      this.compare = compare || this.compare;
      this.visitor = visitor || this.visitor
    }
    compare(a, b) {
      return a - b;
    }
    visitor(v) {
      console.log(v);
    }
    add(el) {
      if (!el) return;
      if (!this.root) {
        this.root = new Node(el, null);
      } else {
        let parent;
        let compare;
        let currentNode = this.root;

        while(currentNode) {
          parent = currentNode;
          compare = this.compare(el, currentNode.el);
          // 左数
          if (compare > 0) {
            currentNode = currentNode.right;
          } else if (compare < 0) {
            currentNode = currentNode.left;
          } else {
            currentNode.el = el;
            return
          }
        }
        const newNode = new Node(el, parent);
        if (compare > 0) {
          parent.right = newNode;
        } else {
          parent.left = newNode;
        }
      }
      this.size++;
    }
    // 四种遍历方式
    prevNodeList(fn) {
      const travel = (node) => {
        if (!node) {
          return;
        }
        if (fn) {
          node = fn(node);
        }
        this.visitor('先序：' + node.el);
        travel(node.left);
        travel(node.right);
      }
      travel(this.root);
    }
    middleNodeList(fn) {
      const travel = (node) => {
        if (!node) {
          return;
        }
        if (fn) {
          node = fn(node);
        }
        travel(node.left);
        this.visitor('中序：' + node.el);
        travel(node.right);
      }
      travel(this.root);
    }
    lastNodeList(fn) {
      const travel = (node) => {
        if (!node) {
          return;
        }
        if (fn) {
          node = fn(node);
        }
        travel(node.left);
        travel(node.right);
        this.visitor('后序：' + node.el);
      }
      travel(this.root);
    }
    layerNodeList(fn) {
      let stack = [];
      let i = 0;
      stack[i] = this.root;
      const travel = () => {
        let node;
        while(node = stack[i++]){
          if (fn) {
            node = fn(node);
          }
          this.visitor('层次访问：' + node.el);
          node.left && stack.push(node.left);
          node.right && stack.push(node.right);
        }
        stack = [];
      }
      travel();
    }
    // 反转二叉树
    reverseBst(mode) {
      const reverse = (node) => {
        let tmp;
        tmp = node.left;
        node.left = node.right;
        node.right = tmp;
        return node;
      }
      if (mode === 'prev') {
        this.prevNodeList(reverse);
      } else if (mode === 'middle') {
        this.middleNodeList(reverse);
      } else if (mode === 'last') {
        this.lastNodeList(reverse);
      } else if (mode === 'layer') {
        this.layerNodeList(reverse);
      }
    }
  }
  const treeNode = [8, 3, 10, 2, 9];
  const tree = new CreateTree();
  treeNode.forEach((el) => {
    tree.add(el);
  });
  /*
      8               8
    3   10        10     3
   2   9            9      2

   先序：8 3 2 10 9      8 10 9 3 2
   中序：2 3 8 9 10      10 9 8 3 2
   后序：2 3 9 10 8      9 10 2 3 8
   层次：8 3 10 2 9      8 10 3 9 2
  */
  // console.dir(tree.root, {depth: 1000})
  // console.log(tree.size);
  // tree.prevNodeList();
  // tree.middleNodeList();
  // tree.lastNodeList();
  // tree.layerNodeList();
  tree.reverseBst('layer');
}

bst();