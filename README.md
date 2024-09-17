概要

このプロジェクトは Next.js を使用して作成された大学生のための Web アプリケーションです。ユーザーはこのアプリを通して授業の時間割を管理したり、課題を共有してわからない問題についてを他のユーザーの知見を得ることができます。

URL: https://classgu.sharettle.com

使用技術
フロントエンド: Next.js, React, MUI  
インフラ: lolipop レンタルサーバー  
バックエンド: PHP  
データベース: Firebase Firestore  
認証: Firebase Authentication  
バージョン: Next.js 14.2.5  



機能一覧  
ユーザー認証: Email とパスワードでログイン　大学のアドレスを持っているユーザーのみ新規登録可能  
ダッシュボード: 時間割管理、プロフィール変更  
検索：文字検索と、学年や専攻によるフィルター  
授業の追加：授業コードを入力するとその授業の情報を取得できる。 (PHP)  
お気に入り：授業ページでハートを押すとお気に入りに登録  
課題共有：自信の GoogleDrive に保存した URL を共有  
背景変更：背景を好きな画像にカスタマイズできます。位置や大きさも変更できます
PWA : モバイル、デスクトップでアプリとして利用可能  


ダッシュボード  
![スクリーンショット 2024-09-18 3 01 00（2）](https://github.com/user-attachments/assets/debd105f-7125-4d9e-a56f-3f769e76911c)

ダッシュボードはできるだけシンプルにしました。ボタンの色とその機能の画面の色を統一させて初めて使う方ができるだけ覚えやすいように工夫しました。　　

  　　
My時間割
![スクリーンショット 2024-09-18 3 13 46（2）](https://github.com/user-attachments/assets/1dfc735c-c749-4d5e-a7fa-def67c38f383)


![スクリーンショット 2024-09-18 3 17 31（2）](https://github.com/user-attachments/assets/b9d11b44-2190-4725-81f9-5679187a0a41)
編集モードでは　授業名が長いときに自分でわかるように短くしたり曜日や時限を変更できます。  


検索機能
![スクリーンショット 2024-09-18 3 13 30（2）](https://github.com/user-attachments/assets/9fa10c38-5b6a-4d03-a6cf-59e731b0da4e)
見たい授業をいち早く検索できるように学年、学期、曜日などさまざまフィルター機能をつけました。



