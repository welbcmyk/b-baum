import { InputGroup, ThemeProvider } from "react-bootstrap";
import BTreeNode from "./b-tree-node.helpers";

export default class BTree {
    constructor(order) {
        this.order = order;
        this.root = null;
    }


    // searches value recursive in the tree and returns the node
    searchVal(node, val, depthObj) {
        console.log(val);
        if(this.root === null) {
            return null;
        }
        depthObj.depth = depthObj.depth + 1;
        if(node.values.includes(val)) {
            return node;
        }
        if(node.isLeaf) {
            // Value not found
            return null;
        }
        let nextSearchNodePos = 0;
        while(nextSearchNodePos <= node.numberOfValues && node.values[nextSearchNodePos] < parseInt(val, 10)) {
            nextSearchNodePos++;
        }
        return this.searchVal(node.children[nextSearchNodePos], val, depthObj);
    }

    // inserts value into the tree
    insert(val) {
        if(this.root == null) {
            this.root = new BTreeNode(true);
            this.root.addValue(val);
            this.root.BTree = this;
            return;
        }
        const currentNode = this.root;
        if(currentNode.numberOfValues === 2 * this.order - 1) {
            // root is full, this means new node root has to be made by splitting
            const newNode = new BTreeNode(false);
            newNode.tree = this;
            this.root = newNode;
            newNode.addChild(currentNode, 0);
            this.split(currentNode, newNode, 1);
            this.insertIntoNotFullNode(newNode, parseInt(val));
        } else {
            this.insertIntoNotFullNode(currentNode, parseInt(val));
        }
    }

    // splits child node from parent node into parent.values[pos-1] and parent.values[pos]
    split(child, parent, pos) {
        const newChild = new BTreeNode(child.isLeaf);
        newChild.tree = this.root.tree;
        for (let i = 1; i < this.order; i++) {
            newChild.addValue(child.removeValue(this.order));
        }
        if(!child.isLeaf) {
            for (let i = 1; i <= this.order; i++) {
                newChild.addChild(child.removeChild(this.order), i-1);
            }
        }
        parent.addChild(newChild, pos);
        parent.addValue(child.removeValue(this.order - 1));
        parent.isLeaf = false;
    }
    
    // insert a value into a node that hasn't reached the maximum number of values
    insertIntoNotFullNode(node, val) {
        if(node.values.includes(val)){
            // value already exists
            return;
        }
        if(node.isLeaf) {
            node.addValue(val);
            return;
        }
        let temp = node.numberOfValues;
        while(temp >= 1 && val < node.values[temp - 1]) {
            temp = temp - 1;
        }
        if(node.children[temp].numberOfValues === 2 * this.order - 1) {
            this.split(node.children[temp], node, temp + 1);
            if(val > node.values[temp]) {
                temp++;
            }
        }
        this.insertIntoNotFullNode(node.children[temp], val);
    }

    // deletes a value in the tree 
    delete(val) {
        if(this.root === null) {
            return;
        }
        if(this.root.values.includes(val) && this.root.isLeaf) {
            this.root.removeValue(this.root.values.indexOf(val));
            return true;
        }
        if(this.rootCanSkrinkIntoChildren()) {
            this.merge(this.root.children[1], this.root.children[0]);
            this.root = this.root.children[0];  
        }
        return this.deleteFromNode(this.root, parseInt(val, 10));
    }

    // deletes a value in a node
    deleteFromNode(node, val) {
        const index = node.values.indexOf(val);
        // check if value is in node
        if(index >= 0) {
            // check if node has enough values with out the deleted one and is a leaf
            if(node.isLeaf && node.numberOfValues > this.order - 1) {
                node.removeValue(node.values.indexOf(val));
                return true;
            }

            // check if a child could transfer a value
            if(node.children[index].numberOfValues > this.order - 1 || 
                node.children[index + 1]. numberOfValues > this.order - 1) {
                //one or both have enough
                if(node.children[index].numberOfValues > this.order - 1) {
                    const leftVal = this.getMaxFromBranch(node.children[index]);
                    node.values[index] = leftVal;
                    return this.deleteFromNode(node.children[index], leftVal);
                }
                const rightVal = this.getMinFromBranch(node.children[index+1]);
                node.values[index] = rightVal;
                return this.deleteFromNode(node.children[index+1], rightVal);
            }
            this.merge(node.children[index + 1], node.children[index]);
            return this.deleteFromNode(node.children[index], val);
        }
        if(node.isLeaf) {
            // val couldn't be found
            return false;
        }
        // value is not in the node
        let indexOfNextNode = 0;
        while (indexOfNextNode < node.numberOfValues && node.values[indexOfNextNode] < val) {
            indexOfNextNode++;
        }
        
        if(node.children[indexOfNextNode].numberOfValues > this.order - 1) {
            return this.deleteFromNode(node.children[indexOfNextNode], val);
        }

        // child has not enough values and needs to balance or merge
        if ((indexOfNextNode > 0 && node.children[indexOfNextNode - 1].numberOfValues > this.order - 1) ||
        (indexOfNextNode < node.numberOfValues && node.children[indexOfNextNode + 1].numberOfValues > this.order - 1)) {
            if(indexOfNextNode > 0 && node.children[indexOfNextNode - 1].numberOfValues > this.order - 1) {
                this.balance(node.children[indexOfNextNode - 1], node.children[indexOfNextNode]);
            } else {
                this.balance(node.children[indexOfNextNode + 1], node.children[indexOfNextNode]);
            }
            return this.deleteFromNode(node.children[indexOfNextNode], val);
        }
        this.merge(indexOfNextNode > 0 ? node.children[indexOfNextNode - 1] : node.children[indexOfNextNode + 1], node.children[indexOfNextNode]);
        return this.deleteFromNode(indexOfNextNode > 0 ? node.children[indexOfNextNode - 1] : node.children[indexOfNextNode], val);
    }

    // transfers one value from one node into another node
    balance(origin, target) {
        const indexOrigin = origin.parentNode.children.indexOf(origin);
        const indexTarget = origin.parentNode.children.indexOf(target);
        if (indexOrigin < indexTarget) {
          target.addValue(target.parentNode.removeValue(indexOrigin));
          origin.parentNode.addValue(origin.removeValue(origin.numberOfValues - 1));
          if (!origin.isLeaf) {
            target.addChild(origin.removeChild(origin.children.length - 1), 0);
          }
        } else {
          target.addValue(target.parentNode.removeValue(indexTarget));
          origin.parentNode.addValue(origin.removeValue(0));
          if (!origin.isLeaf) {
            target.addChild(origin.removeChild(0), target.children.length);
          }
        }
    
    }

    // merges two nodes
    merge(origin, target) {
        const indexOrigin = origin.parentNode.children.indexOf(origin);
        const indexTarget = target.parentNode.children.indexOf(target);
        target.addValue(target.parentNode.removeValue(Math.min(indexOrigin, indexTarget)));
        for (let i = origin.numberOfValues - 1; i >= 0; i--) {
          target.addValue(origin.removeValue(i));
        }
        // Remove reference to origin node
        target.parentNode.removeChild(indexOrigin);
        // Transfer all the children from origin node to target
        if (!origin.isLeaf) {
          while (origin.children.length) {
            if(indexOrigin > indexTarget) {
                target.addChild(origin.removeChild(0), target.children.length) 
            } else {
                target.addChild(origin.removeChild(origin.children.length-1), 0);
            }
          }
        }
    }

    rootCanSkrinkIntoChildren() {
        const hasOneElement = this.root.numberOfValues === 1;
        const isNotLeaf = !this.root.isLeaf;
        const leftChildHasMinNumOfVals = this.root.children[0].numberOfValues === this.order-1;
        const rightChildHasMinNumOfVals = this.root.children[1].numberOfValues === this.order -1;
        return hasOneElement && isNotLeaf && leftChildHasMinNumOfVals && rightChildHasMinNumOfVals;
    }

    getMinFromBranch(node) {
        while(!node.isLeaf) {
            node = node.children[0];
        }
        return node.values[0];
    }

    getMaxFromBranch(node) {
        while(!node.isLeaf) {
            node = node.children[node.numberOfValues];
        }
        return node.values[node.numberOfValues - 1];
    }

    toJSON() {
        if(this.root === null) {
            return {};
        }
        return this.root.toJSON();
    }
}