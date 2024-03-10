window.__tt ||= {}
__tt.draggableTextarea = class {
  shapeId = null
  el = null
  textArea = null
  resizeHandle = null
  deleteBtn = null
  isDragging = false
  isResizing = false
  width = 200
  height = 80
  mouseX = 0
  mouseY = 0
  boundResize = null
  boundStopResize = null
  borderColor = '#ec4899'
  textColor = '#ec4899'
  handleGradient = 'linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(190,24,93,1) 60%, rgba(190,24,93,1) 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 75%, rgba(190,24,93,1) 75%, rgba(190,24,93,1) 85%, rgba(0,0,0,0) 85%)'
  accentColor = 'rgb(190,24,93)'
  fontSize = '18px'


  constructor(shapeId) {
    this.shapeId = Number(shapeId)
    this.initElement()
    document.body.prepend(this.el)
    this.initEvents()
    this.boundResize = null
    this.boundStopResize = null
  }

  initElement() {
    this.el = document.createElement('div')
    this.el.dataset.shapeId = this.shapeId
    this.textArea = document.createElement('textarea')
    this.textArea.placeholder = 'テキストを入力'
    this.setPositionToScreenTopLeft()
    this.updateStyle()
    this.updateTextAreaStyle()
    this.el.appendChild(this.textArea)
    this.createDeleteBtn()
    this.el.appendChild(this.deleteBtn)
    this.createResizeHandles()
    this.createFontSizeToggle()
  }

  updateStyle() {
    Object.assign(this.el.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: 'absolute',
      zIndex: 10000000 + this.shapeId,
      cursor: 'move',
      display: 'flex',
      justifyContent: 'left',
      alignItems: 'normal',
      userSelect: 'none',
    })
  }

  updateTextAreaStyle(showBorder = false) {
    Object.assign(this.textArea.style, {
      color: this.textColor, // テキストエリアの文字色を設定
      resize: 'none', // リサイズハンドルを非表示に
      boxSizing: 'border-box', // パディングとボーダーを含めたサイズで表示
      width: `${this.width - 30}px`,
      height: `${this.height - 30}px`,
      marginTop: '15px',
      marginLeft: '15px',
      border: showBorder ? `2px dashed ${this.borderColor}` : `2px dashed transparent`, // ボーダーカラーを指定
      borderRadius: '8px', // 角の丸みを指定
      padding: '4px', // 内部のパディングを指定
      outline: 'none', // フォーカス時のアウトラインを削除
      overflow: 'hidden', // スクロールバーを非表示に
      fontSize: this.fontSize, // フォントサイズを大きくする
      fontWeight: 'bold', // フォントを太字にする
      background: 'transparent', // 背景色を透過に設定
      textShadow: '1px 1px 0px #fff, -1px -1px 0px #fff, -1px 1px 0px #fff, 1px -1px 0px #fff, 1px 0px 0px #fff, -1px 0px 0px #fff, 0px 1px 0px #fff, 0px -1px 0px #fff, 0px 0px 1px #fff',
    })
  }

  createFontSizeToggle() {
    // フォントサイズを切り替えるボタンを生成
    this.fontSizeToggle = document.createElement('div')
    this.fontSizeToggle.textContent = 'A' // ボタンのテキストを変更
    Object.assign(this.fontSizeToggle.style, {
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '20px', // ボタンの幅を設定
      height: '20px', // ボタンの高さを設定
      background: this.accentColor,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      visibility: 'hidden',
      fontSize: '16px', // ボタンのフォントサイズを設定
    })
    this.el.appendChild(this.fontSizeToggle)
    // ボタンクリック時のイベントを追加
    this.fontSizeToggle.addEventListener('click', () => {
      this.toggleFontSize()
    })
  }

  createDeleteBtn() {
    this.deleteBtn = document.createElement('div')
    Object.assign(this.deleteBtn.style, {
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
    })
    this.deleteBtn.textContent = '×'
    this.deleteBtn.addEventListener('click', () => {
      this.deleteElement()
    })
  }

  createResizeHandles() {
    // 単一のリサイズハンドルを生成
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
    this.el.appendChild(this.resizeHandle)
    this.resizeHandle.addEventListener('mousedown', (e) => {
      this.initResize(e)
    })
  }

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

  resize(e) {
    if (this.isResizing) {
      const widthChange = e.clientX - this.mouseX
      const heightChange = e.clientY - this.mouseY
      this.width = Math.max(100, this.width + widthChange)
      this.height = Math.max(80, this.height + heightChange)

      // スタイルを更新します
      this.updateStyle()
      this.updateTextAreaStyle(true)

      // 高さが一定以下の場合はdeleteBtnを非表示にする
      if (this.height < 40) {
        this.deleteBtn.style.visibility = 'hidden'
      } else {
        this.deleteBtn.style.visibility = 'visible'
      }
      // 次のイベントのためにマウス位置を保持します
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    }
  }

  stopResize() {
    if (this.isResizing) {
      this.isResizing = false
    }
    // イベントハンドラの削除
    document.removeEventListener('mousemove', this.boundResize)
    document.removeEventListener('mouseup', this.boundStopResize)
    // 参照をクリア
    this.boundResize = null
    this.boundStopResize = null
  }

  setPositionToScreenTopLeft() {
    // 現在のスクロール位置を取得
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // スクロールされた状態でも画面の左上に配置
    this.el.style.left = `${scrollX + 15}px`
    this.el.style.top = `${scrollY + 15}px`
  }

  initEvents() {
    this.el.addEventListener('mousedown', (e) => {
      // ブラウザのデフォルトの選択やドラッグ動作を抑止
      if (e.target !== this.textArea) {
        e.preventDefault()
        // クリックされた座標と要素の左上角からの相対位置を計算
        const rect = this.el.getBoundingClientRect()
        this.offsetX = e.clientX - rect.left
        this.offsetY = e.clientY - rect.top
        this.isDragging = true

        // ドラッグ中の透明度の変化を追加
        this.el.style.opacity = '0.8'
      }
    })

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        // 移動中の要素の位置を設定
        e.preventDefault() // ドラッグ操作中のテキスト選択などを防ぐ

        // スクロール量を加味した位置を計算
        const x = e.clientX - this.offsetX + window.scrollX
        const y = e.clientY - this.offsetY + window.scrollY

        this.el.style.left = `${x}px`
        this.el.style.top = `${y}px`
      }
    })

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false
        this.el.style.opacity = '1' // ドラッグ終了時の透明度を元に戻す
      }
    })
    // 要素にカーソルが乗ったときにリサイズハンドル・削除ボタンを表示する
    this.el.addEventListener('mouseenter', () => {
      this.resizeHandle.style.visibility = 'visible'
      this.fontSizeToggle.style.visibility = 'visible'
      this.updateTextAreaStyle(true) // マウスホバー時に枠線を表示
      if (this.height >= 40) {
        this.deleteBtn.style.visibility = 'visible'
      }
    })
    // 要素からカーソルが離れたときにリサイズハンドル・削除ボタンを隠す
    this.el.addEventListener('mouseleave', () => {
      if (!this.isResizing) {
        this.resizeHandle.style.visibility = 'hidden'
        this.updateTextAreaStyle(false)
      }
      this.fontSizeToggle.style.visibility = 'hidden'
      this.deleteBtn.style.visibility = 'hidden'
    })
  }

  toggleFontSize() {
    // フォントサイズを切り替える関数
    if (this.fontSize === '18px') {
      this.fontSize = '24px'
    } else {
      this.fontSize = '18px'
    }
    this.updateTextAreaStyle()
  }

  deleteElement() {
    document.body.removeChild(this.el)
  }
}
__tt.shapes ||= []
__tt.shapes.push(new __tt.draggableTextarea(__tt.shapes.length + 1))
