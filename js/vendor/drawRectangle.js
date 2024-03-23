window.__tt ||= {}
__tt.DrawRectangle = class {
  constructor(shapeId) {
    this.shapeId = Number(shapeId)
    this.element = null
    this.shape = null
    this.resizeHandle = null
    this.deleteButton = null
    this.isInteracting = false
    this.isDragging = false
    this.isResizing = false
    this.width = 200
    this.height = 90
    this.mouseX = 0
    this.mouseY = 0
    this.boundResize = null
    this.boundStopResize = null
    this.borderColor = '#ec4899'
    this.accentColor = 'rgb(107, 114, 128)'
    this.handleGradient = `linear-gradient(135deg, rgba(0,0,0,0) 60%, ${this.accentColor} 60%, ${this.accentColor} 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 80%, ${this.accentColor} 80%, ${this.accentColor} 90%, rgba(0,0,0,0) 90%)`
    this.fontFamily = `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif`
    this.init()
  }

  init() {
    this.createDraggableRectangleElement()
    document.body.prepend(this.element)
    this.attachEvents()
    this.boundResize = null
    this.boundStopResize = null
  }

  // ドラッグ可能な要素を作成する
  createDraggableRectangleElement() {
    this.element = document.createElement('div')
    this.element.dataset.shapeId = this.shapeId
    this.shape = document.createElement('div')
    this.setElementPositionToTopLeft()
    this.updateElementStyle()
    this.updateShapeStyle()
    this.element.appendChild(this.shape)
    this.createDeleteButton()
    this.element.appendChild(this.deleteButton)
    this.createResizeHandle()
  }

  // 要素のスタイルを更新する
  updateElementStyle() {
    Object.assign(this.element.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'absolute',
      zIndex: 10000000 + this.shapeId,
      cursor: 'move',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'normal',
      userSelect: 'none',
      border: this.isInteracting ? `1px solid ${this.accentColor}` : `1px solid transparent`,
      boxSizing: 'border-box',
    })
  }

  // 長方形のスタイルを更新する
  updateShapeStyle() {
    Object.assign(this.shape.style, {
      boxSizing: 'border-box',
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: `4px solid ${this.borderColor}`,
      borderRadius: '15px',
    })
  }

  // 削除ボタンを作成する
  createDeleteButton() {
    this.deleteButton = document.createElement('div')
    Object.assign(this.deleteButton.style, {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '20px',
      height: '20px',
      background: this.accentColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      visibility: 'hidden',
      fontSize: '24px',
      fontFamily: this.fontFamily,
    })
    this.deleteButton.textContent = '×'
    this.deleteButton.addEventListener('click', () => {
      this.deleteElement()
    })
  }

  // リサイズハンドルを作成する
  createResizeHandle() {
    this.resizeHandle = document.createElement('div')
    Object.assign(this.resizeHandle.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      bottom: '0',
      right: '0',
      background: this.handleGradient,
      cursor: 'nwse-resize',
      visibility: 'hidden',
    })
    this.element.appendChild(this.resizeHandle)
    this.resizeHandle.addEventListener('mousedown', (e) => {
      this.initResize(e)
    })
  }

  // リサイズを初期化する
  initResize(e) {
    e.stopPropagation()
    this.isResizing = true
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    this.boundResize = this.resize.bind(this)
    this.boundStopResize = this.stopResize.bind(this)
    document.addEventListener('mousemove', this.boundResize)
    document.addEventListener('mouseup', this.boundStopResize)
    this.resizeHandle.style.visibility = 'visible'
  }

  // リサイズを実行する
  resize(e) {
    if (this.isResizing) {
      const widthChange = e.clientX - this.mouseX
      const heightChange = e.clientY - this.mouseY
      this.width = Math.max(60, this.width + widthChange)
      this.height = Math.max(38, this.height + heightChange)
      this.isInteracting = true
      this.updateElementStyle()
      this.updateShapeStyle()
      if (this.height < 40) {
        this.deleteButton.style.visibility = 'hidden'
      } else {
        this.deleteButton.style.visibility = 'visible'
      }
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    }
  }

  // リサイズを停止する
  stopResize() {
    if (this.isResizing) {
      this.isResizing = false
    }
    document.removeEventListener('mousemove', this.boundResize)
    document.removeEventListener('mouseup', this.boundStopResize)
    this.boundResize = null
    this.boundStopResize = null
  }

  // 要素を画面の左上に配置する
  setElementPositionToTopLeft() {
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    this.element.style.left = `${scrollX + 100 + ((this.shapeId - 1) * 15)}px`
    this.element.style.top = `${scrollY + 80 + ((this.shapeId - 1) * 15)}px`
  }

  // イベントをアタッチする
  attachEvents() {
    this.element.addEventListener('mousedown', (e) => {
      e.preventDefault()
      const rect = this.element.getBoundingClientRect()
      this.offsetX = e.clientX - rect.left
      this.offsetY = e.clientY - rect.top
      this.isDragging = true
      this.element.style.opacity = '0.8'
    })

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        // ドラッグ操作中のテキスト選択などを防ぐ
        e.preventDefault()
        const x = e.clientX - this.offsetX + window.scrollX
        const y = e.clientY - this.offsetY + window.scrollY
        this.element.style.left = `${x}px`
        this.element.style.top = `${y}px`
      }
    })

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false
        this.element.style.opacity = '1'
      }
    })

    this.element.addEventListener('mouseenter', () => {
      this.isInteracting = true
      this.updateElementStyle()
      this.resizeHandle.style.visibility = 'visible'
      if (this.height >= 40) {
        this.deleteButton.style.visibility = 'visible'
      }
    })

    this.element.addEventListener('mouseleave', () => {
      this.isInteracting = false
      this.updateElementStyle()
      if (!this.isResizing) {
        this.resizeHandle.style.visibility = 'hidden'
      }
      this.deleteButton.style.visibility = 'hidden'
    })
  }

  // 要素を削除する
  deleteElement() {
    document.body.removeChild(this.element)
  }
}

__tt.shapes ||= []
__tt.shapes.push(new __tt.DrawRectangle(__tt.shapes.length + 1))
