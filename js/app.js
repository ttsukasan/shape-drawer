import {minify} from 'terser'

// jsをテキストとして取得
const fileUrls = ["/js/vendor/drawRectangle.js"];
Promise.all(fileUrls.map(url =>
  fetch(url).then(response => response.text())
)).then(async responses => {
  // ファイルの内容が配列に格納される
  const fileContents = responses;
  const result = await minify(fileContents[0], {sourceMap: true});
  // #divDrawRectangleの中の .bookmarklet を取得
  const buttonDrawRectangle = document.getElementById('buttonDrawRectangle');
  buttonDrawRectangle.href = `javascript:${result.code}void(0);`;
  // ボタンを表示
  buttonDrawRectangle.style.display = 'inline';
}).catch(error => {
  console.error('ファイルを読み込めませんでした。', error);
  document.getElementById('errorAlert').style.display = 'block';
});
