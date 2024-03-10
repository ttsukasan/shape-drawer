import {minify} from 'terser'

// jsをテキストとして取得
// github pagesではbase pathが変わることを考慮している TODO: 環境変数にしたい
const fileUrls = ["js/vendor/drawRectangle.js", "js/vendor/drawTextarea.js"].map(path => `${window.location.pathname}${path}`);
Promise.all(fileUrls.map(url =>
  fetch(url).then(response => response.text())
)).then(async responses => {
  // ファイルの内容が配列に格納される
  const fileContents = responses;
  const result0 = await minify(fileContents[0], {sourceMap: true});
  // #divDrawRectangleの中の .bookmarklet を取得、ボタンを表示
  const buttonDrawRectangle = document.getElementById('buttonDrawRectangle');
  buttonDrawRectangle.href = `javascript:${result0.code}void(0);`;
  buttonDrawRectangle.style.display = 'inline';
  const result1 = await minify(fileContents[1], {sourceMap: true});
  const buttonDrawTextarea = document.getElementById('buttonDrawTextarea');
  buttonDrawTextarea.href = `javascript:${result1.code}void(0);`;
  buttonDrawTextarea.style.display = 'inline';
}).catch(error => {
  console.error('ファイルを読み込めませんでした。', error);
  document.getElementById('errorAlert').style.display = 'block';
});
