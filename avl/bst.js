// 二叉排序树

class BSTTree extends Tree{
    constructor() {
        super()
    }

    /**
     * @param node 要添加的节点
     * @returns {boolean} 是否插入成功，若插入一个已存在的节点则返回失败
     */
    add(value) {
        let isSuccess = true
        if (this.root === null) {
            this.root = new Node(value)
        } else {
            let findRes = this.find(value)
            switch (findRes.target) {
                case 'self':
                    isSuccess = false
                    break
                case 'left':
                    findRes.node.left = new Node(value)
                    break
                case 'right':
                    findRes.node.right = new Node(value)
                    break
            }
        }
        if (isSuccess) this._length++
        return isSuccess
    }

    remove(value) {
        let {node, target} = this.find(value)
        if (target === 'self') {
            let parent = node.parent
            let newNode     // 顶替删除节点位置的新节点
            if (node.right) {
                if (node.left) {  // 左右树都存在时，把左树中的最大值替换到删除的节点处
                    newNode = this.findMax(node.left)
                    if (newNode.parent !== node) {     // 当新节点的父节点不是要删除的节点时，需要把新节点的子树连接到新节点的父节点上，新节点继承删除节点的左子树
                        newNode.parent.right = newNode.left
                        newNode.left = node.left
                    }
                    newNode.right = node.right
                } else {
                    newNode = node.right
                }
            } else if (node.left) {
                newNode = node.left
            }
            if (parent) {
                parent[node.parentIndex] = newNode
            } else {
                this.root = newNode
                newNode.parent = undefined
            }
            node.parent = undefined
            node.left = undefined
            node.right = undefined
            this._length--
            return true
        } else {
            return false
        }
    }

}