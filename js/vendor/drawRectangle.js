window.__tt ||= {}
__tt.draggableCircle ||= class DraggableCircle {
  el = null
  handles = []
  isDragging = false
  isResizing = false
  width = 200
  height = 80
  mouseX = 0
  mouseY = 0
  boundResize = null
  boundStopResize = null

  constructor() {
    this.initElement()
    document.body.prepend(this.el)
    this.initEvents()
    this.boundResize = null;
    this.boundStopResize = null;
  }

  initElement() {
    this.el = document.createElement("div");
    this.ellipse = document.createElement("div"); // 楕円要素を作成
    this.deleteBtn = document.createElement("div"); // 削除ボタンを作成
    // 削除ボタンのスタイルを設定
    Object.assign(this.deleteBtn.style, {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '20px',
      height: '20px',
      background: 'rgb(227, 57, 78)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      visibility: 'hidden',
      fontSize: '24px',
    });
    this.deleteBtn.textContent = '×';
    this.deleteBtn.addEventListener('click', () => {
      this.deleteElement();
    });

    this.setPositionToScreenTopLeft();

    // 親要素のスタイルを更新
    this.updateStyle();

    // 子要素である楕円のスタイルを更新
    this.updateEllipseStyle();

    this.el.appendChild(this.ellipse); // 楕円を親要素に追加
    this.el.appendChild(this.deleteBtn); // 削除ボタンを親要素に追加
    this.createResizeHandles(); // リサイズハンドルを作成
  }


  updateStyle() {
    Object.assign(this.el.style, {
      width: `${this.width}px`,
      height: `${this.height}px`,
      position: "absolute",
      zIndex: "999999",
      cursor: "move",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      userSelect: "none",
    });
  }

  updateEllipseStyle() {
    Object.assign(this.ellipse.style, {
      width: "100%",
      height: "100%",
      border: "4px solid #EC71A1",
      borderRadius: "15px",
      // boxShadow: "0px 10px 30px rgba(0,0,0,0.2)"
    });
  }

  createResizeHandles() {
    const handle = document.createElement("div");
    Object.assign(handle.style, {
      position: 'absolute',
      width: '20px',
      height: '20px',
      bottom: '-2px',
      right: '-2px',
      background: 'linear-gradient(135deg, rgba(0,0,0,0) 60%, rgba(227,57,78,1) 60%, rgba(227,57,78,1) 70%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 75%, rgba(227,57,78,1) 75%, rgba(227,57,78,1) 85%, rgba(0,0,0,0) 85%)',
      cursor: 'nwse-resize',
      visibility: 'hidden'
    });

    this.handles.push(handle);
    this.el.appendChild(handle);
    handle.addEventListener('mousedown', (e) => {
      this.initResize(e);
    });
  }


  initResize(e) {
    e.stopPropagation();
    this.isResizing = true;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.boundResize = this.resize.bind(this);
    this.boundStopResize = this.stopResize.bind(this);
    document.addEventListener('mousemove', this.boundResize);
    document.addEventListener('mouseup', this.boundStopResize);
    // リサイズ操作中にハンドルを表示
    this.handles.forEach(handle => handle.style.visibility = 'visible');
  }

  resize(e) {
    if (this.isResizing) {
      const widthChange = e.clientX - this.mouseX;
      const heightChange = e.clientY - this.mouseY;
      this.width = Math.max(40, this.width + widthChange);
      this.height = Math.max(8, this.height + heightChange);

      // スタイルを更新します
      this.updateStyle();
      this.updateEllipseStyle();

      // 高さ20px以下の場合はdeleteBtnを非表示にする
      if (this.height < 30) {
        this.deleteBtn.style.visibility = 'hidden';
      } else {
        this.deleteBtn.style.visibility = 'visible';
      }

      // 次のイベントのためにマウス位置を保持します
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  }

  stopResize() {
    if (this.isResizing) {
      this.isResizing = false;
    }
    // イベントハンドラの削除
    document.removeEventListener('mousemove', this.boundResize);
    document.removeEventListener('mouseup', this.boundStopResize);
    // 参照をクリア
    this.boundResize = null;
    this.boundStopResize = null;
  }

  setPositionToScreenTopLeft() {
    // 現在のスクロール位置を取得
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // スクロールされた状態でも画面の左上に配置
    this.el.style.left = `${scrollX + 15}px`;
    this.el.style.top = `${scrollY + 15}px`;
  }


  initEvents() {
    this.el.addEventListener('mousedown', (e) => {
      // ブラウザのデフォルトの選択やドラッグ動作を抑止
      e.preventDefault();

      // クリックされた座標と要素の左上角からの相対位置を計算
      const rect = this.el.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      this.isDragging = true;

      // ドラッグ中の透明度の変化を追加
      this.el.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        // 移動中の要素の位置を設定
        e.preventDefault(); // ドラッグ操作中のテキスト選択などを防ぐ

        // スクロール量を加味した位置を計算
        const x = e.clientX - this.offsetX + window.scrollX;
        const y = e.clientY - this.offsetY + window.scrollY;

        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.el.style.opacity = '1'; // ドラッグ終了時の透明度を元に戻す
      }
    });
    // 要素にカーソルが乗ったときにリサイズハンドル・削除ボタンを表示する
    this.el.addEventListener('mouseenter', () => {
      this.handles.forEach(handle => {
        handle.style.visibility = 'visible';
      });
      if (this.height >= 30) {
        this.deleteBtn.style.visibility = 'visible';
      }

    });
    // 要素からカーソルが離れたときにリサイズハンドル・削除ボタンを隠す
    this.el.addEventListener('mouseleave', () => {
      // リサイズ中でなければハンドルを隠す
      if (!this.isResizing) {
        this.handles.forEach(handle => {
          handle.style.visibility = 'hidden';
        });
      }
      this.deleteBtn.style.visibility = 'hidden'
    });

  }

  deleteElement() {
    document.body.removeChild(this.el);
  }
}

// 新しい DraggableCircle インスタンスの作成
__tt[`${Date.now()}`] = new __tt.draggableCircle()
