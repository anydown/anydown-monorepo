# anydown-core monorepo

双方向Markdownエディタ anydown のコアコンポーネントとVSCode拡張を集約したmonorepoです。

- anydown-core
  - anydownのレンダラ・エディタ
- anydown-gantt
  - ガントチャートコンポーネント
- vscode-anydown
  - anydownのVS Code拡張
- vscode-ganttdown
  - ganttdownのVS Code拡張

基本的にVue.js 2系とyarnを利用して開発しています。

利用方法は各ディレクトリのREADME.mdを参照

# Setup

> lerna bootstrap
> lerna run build

あとは各repoにcdした上で

> yarn dev

でDEMOを実行。


