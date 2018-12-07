class Renderer{
    constructor(id, tree) {
        this.canvas = document.getElementById(id)
        this.ctx = this.canvas.getContext('2d')
        this.tree = tree
        this.maxX = 0
    }

    renderTree() {
        this.arr = this.tree.to2DArray()
        this._handlerData()
        this._resizeCanvas()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.arr.forEach((child) => {
            child.forEach((node) => {
                this._renderNode(node.value, node.x, node.y)
                if (node.left) {
                    this._renderLine(node.x, node.y, node.left.x, node.left.y)
                }
                if (node.right) {
                    this._renderLine(node.x, node.y, node.right.x, node.right.y)
                }
            })
        })
    }

    _handlerData() {
        this.arr.reverse().forEach((child, i) => {
            this.arr[i] = child.filter((node, j) => {
                if (node) {
                    if (node.left) {
                        node.leftSpace = node.left.leftSpace + node.left.rightSpace
                    } else {
                        node.leftSpace = 18
                    }
                    if (node.right) {
                        node.rightSpace = node.right.leftSpace + node.right.rightSpace
                    } else {
                        node.rightSpace = 18
                    }
                    return true
                } else {
                    return false
                }
            })
        })
        this.arr.reverse().forEach((child, i) => {
            child.forEach((node, j) => {
                if (node.parent) {
                    if (node.parentIndex === 'left') {
                        node.x = node.parent.x - node.rightSpace
                    } else {
                        node.x = node.parent.x + node.leftSpace
                    }
                    node.y = node.parent.y + 60
                } else {        // 根节点
                    node.x = node.leftSpace
                    node.y = 15
                }
                if (node.x > this.maxX) this.maxX = node.x
            })
        })
    }

    _resizeCanvas() {
        let length = this.arr.length
        this.canvas.height = length * 60 - 30
        this.canvas.width = this.maxX + 15
    }

    /**
     * 绘制节点
     * @param value 节点的数值
     * @param x 节点的中心x坐标
     * @param y 节点的中心y坐标
     * @private
     */
    _renderNode(value, x, y) {
        this.ctx.fillStyle = '#f1f1f1'
        this.ctx.strokeStyle = '#aaa'
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.arc(x, y, 14, 0, 2 * Math.PI)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fill()
        this.ctx.fillStyle = '#666'
        this.ctx.font = '15px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline='middle'
        this.ctx.fillText(value, x, y)
    }

    /**
     * 绘制节点间的连接线
     * @param x1 上方节点的中心x坐标
     * @param y1 上方节点的中心y坐标
     * @param x2 下方节点的中心x坐标
     * @param y2 下方节点的中心y坐标
     * @private
     */
    _renderLine(x1, y1, x2, y2) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1 + 15)
        this.ctx.lineTo(x2, y2 - 15)
        this.ctx.closePath()
        this.ctx.stroke()
    }

}