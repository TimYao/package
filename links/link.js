function link () {

  class Node {
    constructor(el, next){
      this.el = el;
      this.next = next;
    }
  }

  class CreateLink {
    constructor(){
      this.head = null;
      this.size = 0;
    }
    add(index, el) {
      if (arguments.length === 1) {
        el = index;
        index = this.size;
      }
      if (index < 0 || index > this.size) {
        throw ('pos is error');
      }
      if (index === 0) {
        const head = this.head;
        this.head = new Node(el, head);
      } else {
        const prevNode = this.getNode(index-1);
        prevNode.next = new Node(el, prevNode.next);
      }

      this.size++;
    }
    getNode(index) {
      let current = this.head;
      for (let i=0;i<index;i++) {
        current = current.next;
      }
      return current;
    }
    remove(index) {
      let el;
      let node = this.getNode(index);
      const prevNode = this.getNode(index-1);
      prevNode.next = node.next;
      el = node.el;
      node = null;
      return el;
    }
    find(index) {
      return this.getNode(index);
    }
    reserve() {
      // 链表反转
      // 方案一 倒序创建
      // this.reserverOne();
      // 方案二 指针交换
      // this.reserverTwo();
      // 方案三 递归头指针交换反转
      this.reserverThree();
    }
    reserverOne() {
      let prevNode;
      let newNode;
      let nodes;
      for(let i=this.size-1;i>=0;i--){
        let node = this.getNode(i);
        if (!prevNode) {
          nodes = prevNode = node;
        }
        newNode = new Node(node.el, null);
        prevNode.next = newNode;
        prevNode = newNode;
      }
      this.head = nodes.next;
    }
    reserverTwo() {
      let lastNode;
      let prevNode;
      let newHead;
      for(let i=this.size;i>=0;i--){
        lastNode = this.getNode(i);
        if (prevNode) {
          prevNode.next = lastNode;
        } else {
          newHead = lastNode;
        }
        prevNode = lastNode;
      }
      this.head = newHead;
      prevNode.next = null;
      return this.head;
    }
    reserverThree() {
      const reverse = function (head) {
        if (head === null || head.next === null) {
          return head;
        }
        let newHead = reverse(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
      }
      this.head = reverse(this.head);
    }
  }

  const link = new CreateLink();

  // 创建
  link.add('1');
  link.add('2');
  link.add('3');
  // console.dir(link, {depth: 1000});
  // console.dir(link.remove(1), {depth: 1000});
  // console.dir(link, {depth: 1000});

  // console.dir(link, {depth: 1000});
  link.reserve();
  console.dir(link, {depth: 1000});
}

link();