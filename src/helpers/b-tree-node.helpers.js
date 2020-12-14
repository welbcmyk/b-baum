export default class BTreeNode {
    constructor(isLeaf) {
        this.values = [];
        this.isLeaf = isLeaf;
        this.children = [];
        this.parentNode = null;
        this.bTree = null;
    }

    get numberOfValues()  {
        return this.values.length;
    }

    addValue(val) {
        if(!val || this.values.includes(val)) {
            return;
        }
        let pos = 0;
        while(pos < this.numberOfValues &&  this.values[pos] < val) {
            pos++;
        }
        this.values.splice(pos, 0, val);
    }

    removeValue(posOfValue) {
        if(posOfValue >= this.numberOfValues) {
            return null;
        }
        return this.values.splice(posOfValue, 1)[0];
    }

    addChild(node, pos) {
        this.children.splice(pos, 0, node);
        node.parentNode = this;
    }

    removeChild(pos) {
        return this.children.splice(pos, 1)[0];
    }

    toJSON() {
        const  name = this.values.join("|");
        if(this.isLeaf) {
            return {name: name};
        }
        const children = this.children.map((child) => { return child.toJSON(); });
        const data = {
            name: name,
            children: children
        }
        return data;
    }
}