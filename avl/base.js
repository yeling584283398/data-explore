
class Node {
    constructor(value, data) {
        this.value = Number(value)
        if (data) this.data = data
        this.height = 1     // 高度，取左右子树中较高值，没有子树时则为0
    }

    get left() {
        return this._left
    }

    set left(node) {
        if (node) {
            node.parent = this
            node.parentIndex = 'left'       // 处于父节点的哪个方向
        }
        this._left = node
    }

    get right() {
        return this._right
    }

    set right(node) {
        if (node) {
            node.parent = this
            node.parentIndex = 'right'
        }
        this._right = node
    }
}

class Tree {
    constructor() {
        this.root = null
        this._length = 0
    }

    get length() {
        return this._length
    }

    set length(v) {
        console.warn('length为只读属性')
    }

    /**
     * @param value要查找的目标值，root从哪个节点开始找（不传视为从根节点开始找）
     * @returns node找到的节点，target找出的结果（self：找到匹配值，left：查找值比返回节点小，right：查找值比返回节点大）
     **/
    find(value, root) {
        root = root || this.root
        if (value === root.value) {
            return {
                node: root,
                target: 'self'
            }
        } else if (value < root.value) {
            if (root.left) {
                return this.find(value, root.left)
            } else {
                return {
                    node: root,
                    target: 'left'
                }
            }
        } else {
            if (root.right) {
                return this.find(value, root.right)
            } else {
                return {
                    node: root,
                    target: 'right'
                }
            }
        }
    }

    findMax(root) {
        root = root || this.root
        if (root.right) {
            return this.findMax(root.right)
        } else {
            return root
        }
    }

    findMin(root) {
        root = root || this.root
        if (root.left) {
            return this.findMin(root.left)
        } else {
            return root
        }
    }

    forEach(cb, isBigToSmall) {
        if (isBigToSmall) {
            this._forEachB2S(this.root, cb)
        } else {
            this._forEachS2B(this.root, cb)
        }
    }

    _forEachS2B(node, cb) {
        if (node) {
            this._forEachS2B(node.left, cb)
            cb(node)
            this._forEachS2B(node.right, cb)
        }
    }

    _forEachB2S(node, cb) {
        if (node) {
            this._forEachB2S(node.right, cb)
            cb(node)
            this._forEachB2S(node.left, cb)
        }
    }

    to2DArray() {
        var res = []
        this._to2DArray([this.root], res)
        return res
    }

    _to2DArray(nodeList, res) {
        let newList = []
        let hasChild = false
        res.push(nodeList)
        nodeList.forEach((node) => {
            newList.push(node && node.left)
            newList.push(node && node.right)
            if (hasChild === false && node && (node.left || node.right)) hasChild = true
        })
        if (hasChild) this._to2DArray(newList, res)
    }

}