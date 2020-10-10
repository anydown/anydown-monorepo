# リリースフロー

## npmパッケージ

- 変更点をコミット
- standard-versionを実行
- yarn publish

## VSCode Extension

- 依存パッケージのバージョンが上がっていればpackage.jsonに反映させる
  - 上げなくてもlerna bootstrapによりローカルの最新npmパッケージは使えるのだけど一応
- yarn build
- 変更点をコミット
  - 現状assetsもコミットしているがもしかして不要？
- standard-versionを実行
- vsce package --yarn
- vsce publish --yarn
- 一応publish後もテストすること
