// 平衡二叉树

class AVLTree extends Tree {
    constructor() {
        super()
    }

    add(value) {
        let isSuccess = true
        if (this.root === null) {
            this.root = new Node(value)
        } else {
            isSuccess = this._add(this.root, value).isNew
        }
        if (isSuccess) this._length++
        return isSuccess
    }

    _add(root, value) {
        let isNew = true
        let isHeightChanged = false
        if (value < root.value) {
            if (root.left) {
                let addRes = this._add(root.left, value)
                isNew = addRes.isNew
                if (addRes.isHeightChanged) {
                    if (root.height < root.left.height + 1) {
                        root.height = root.left.height + 1
                        isHeightChanged = true
                        if (root.left.height - (root.right ? root.right.height : 0) > 1) {      //高度差大于1需要进行旋转
                            if ((root.left.left ? root.left.left.height : 0) >  (root.left.right ? root.left.right.height : 0)) {
                                this._leftRotation(root, root.left)
                                root.height -= 2
                            } else {
                                let left = root.left, rightOfLeft = root.left.right
                                this._rightRotation(root.left, root.left.right)
                                this._leftRotation(root, root.left)
                                root.height -= 2
                                rightOfLeft.height += 1
                                left.height -= 1
                            }
                            isHeightChanged = false     // 旋转之后高度将降低1，即父节点的高度与原来一致
                        }
                    }
                }
            } else {
                root.left = new Node(value)
                if (!root.right) {
                    root.height = 2
                    isHeightChanged = true
                }
            }
        } else if (value > root.value) {
            if (root.right) {
                let addRes = this._add(root.right, value)
                isNew = addRes.isNew
                if (addRes.isHeightChanged) {
                    if (root.height < root.right.height + 1) {
                        root.height = root.right.height + 1
                        isHeightChanged = true
                        if (root.right.height - (root.left ? root.left.height : 0) > 1) {      //高度差大于1需要进行旋转
                            if ((root.right.right ? root.right.right.height : 0) >  (root.right.left ? root.right.left.height : 0)) {
                                this._rightRotation(root, root.right)
                                root.height -= 2
                            } else {
                                let right = root.right, leftOfRight = root.right.left
                                this._leftRotation(root.right, root.right.left)
                                this._rightRotation(root, root.right)
                                root.height -= 2
                                leftOfRight.height += 1
                                right.height -= 1
                            }
                            isHeightChanged = false     // 旋转之后高度将降低1，即父节点的高度与原来一致
                        }
                    }
                }
            } else {
                root.right = new Node(value)
                if (!root.left) {
                    root.height = 2
                    isHeightChanged = true
                }
            }
        } else {
            isNew = false
        }
        return {isNew, isHeightChanged}
    }

    remove(value) {
        let {node, target} = this.find(value)
        if (target === 'self') {
            this._remove(node)
            this._length--
            return true
        } else {
            return false
        }
    }

    _remove(node) {
        let newNode,     // 顶替删除节点位置的节点
            startingNode4Update     // 更新高度的起点
        if (node.left && node.left.height >= (node.right ? node.right.height : 0)) {     // 左树高度大于右树用左树中的最大值来顶替
            newNode = this.findMax(node.left)
            newNode.parent[newNode.parentIndex] = newNode.left      // 最大值不会有右子树
        } else if (node.right && node.right.height > (node.left ? node.left.height : 0)) {      // 右树高度大于左树用右树中的最小值顶替
            newNode = this.findMin(node.right)
            newNode.parent[newNode.parentIndex] = newNode.right     // 最小值不会有左子树
        }
        startingNode4Update = (newNode && newNode.parent !== node) ? newNode.parent : node.parent
        if (node.parent) {
            node.parent[node.parentIndex] = newNode
        } else {    // 没有父节点，说明是根节点
            this.root = newNode
            newNode.parent = undefined
        }
        if (newNode && newNode !== node.left) newNode.left = node.left
        if (newNode && newNode !== node.right) newNode.right = node.right
        node.left = undefined
        node.right = undefined
        node.parent = undefined
        if (startingNode4Update) this._updateHeightWhenRemove(startingNode4Update)
    }

    /**
     * 删除节点时，向上轮询是否需要更新高度，当出现左右高度差大于1时则做调整
     * @private
     */
    _updateHeightWhenRemove(node) {
        if (!node) return
        let isHeightChanged, nextUpdateNode = node.parent
        let left = node.left, right = node.right
        if (node.height > (right ? right.height : 0) + 1 && node.height > (left ? left.height : 0) + 1) {
            node.height--
            isHeightChanged = true
        }
        if ((left ? left.height : 0) - (right ? right.height : 0) > 1) {
            let leftOfLeft = left.left, rightOfLeft = left.right
            let leftMinusRight = (leftOfLeft ? leftOfLeft.height : 0) - (rightOfLeft ? rightOfLeft.height : 0)
            if (leftMinusRight >= 0) {
                this._leftRotation(node, left)
                if (leftMinusRight > 0) {
                    node.height -= 2
                } else {
                    node.height -= 1
                    left.height += 1
                }
            } else {
                this._rightRotation(left, rightOfLeft)
                this._leftRotation(node, node.left)
                node.height -= 2
                left.height -= 1
                rightOfLeft.height += 1
            }
            isHeightChanged = true
        }
        if ((right ? right.height : 0) - (left ? left.height : 0) > 1) {
            let leftOfRight = right.left, rightOfRight = right.right
            let rightMinusLeft = (rightOfRight ? rightOfRight.height : 0) - (leftOfRight ? leftOfRight.height : 0)
            if (rightMinusLeft >= 0) {
                this._rightRotation(node, right)
                if (rightMinusLeft > 0) {
                    node.height -= 2
                } else {
                    node.height -= 1
                    right.height += 1
                }
            } else {
                this._leftRotation(right, leftOfRight)
                this._rightRotation(node, node.right)
                node.height -= 2
                left.height -= 1
                leftOfRight.height += 1
            }
            isHeightChanged = true
        }
        if (isHeightChanged) this._updateHeightWhenRemove(nextUpdateNode)
    }

    /**
     * 左旋：child上升一个层级，node下降一个层级（当child位于node左侧时）
     * @private
     */
    _leftRotation(node, child) {
        if (node.parent) {
            node.parent[node.parentIndex] = child
        } else {
            this.root = child
            child.parent = undefined
        }
        let right = child.right
        child.right = node
        node.left = right
    }

    /**
     * 右旋：child上升一个层级，node下降一个层级（当child位于node右侧时）
     * @private
     */
    _rightRotation(node, child) {
        if (node.parent) {
            node.parent[node.parentIndex] = child
        } else {
            this.root = child
            child.parent = undefined
        }
        let left = child.left
        child.left = node
        node.right = left
    }

}