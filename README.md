概要

このプロジェクトは Next.js を使用して作成された大学生のための Web アプリケーションです。ユーザーはこのアプリを通して授業の時間割を管理したり、課題を共有してわからない問題についてを他のユーザーの知見を得ることができます。

ブラウザ Chome推奨  
URL: https://classgu.sharettle.com  
ゲストユーザー  
ログインID: guest.user  
パスワード: guestuser  

使用技術
フロントエンド: Next.js, React, MUI  
ホスティング: lolipop レンタルサーバー  
バックエンド: Firebase PHP  
データベース: Firebase Firestore  
認証: Firebase Authentication  
バージョン: Next.js 14.2.5    


使用言語  
TypeScript
62.1%
 
HTML
37.6%
 
JavaScript
0.3%


機能一覧  
ユーザー認証: Email とパスワードでログイン　大学のアドレスを持っているユーザーのみ新規登録可能  
ダッシュボード: 時間割管理、プロフィール変更  
検索：文字検索と、学年や専攻によるフィルター  
授業の追加：授業コードを入力するとその授業の情報を取得できる。 (PHP)    
お気に入り：授業ページでハートを押すとお気に入りに登録    
課題共有：自信の GoogleDrive に保存した URL を共有  
背景変更：背景を好きな画像にカスタマイズできます。位置や大きさも変更できます  
PWA : モバイル、デスクトップでアプリとして利用可能  


    

開発の目的:  
大学では、先輩とのつながりがないと授業に関する情報を得るのが難しいことが多く、  
広範囲にわたる授業内容をすべてカバーするのは困難です。  
そこで、大学内の学生が授業の情報を共有できるサイトを作ることで、  
学生が学習に専念できる環境を提供したいと考えました。  
このサイトを通じて、少しでも学習の助けになることを願っています。  




機能紹介 :

ダッシュボード  
![スクリーンショット 2024-09-18 3 01 00（2）](https://github.com/user-attachments/assets/debd105f-7125-4d9e-a56f-3f769e76911c)

ダッシュボードはできるだけシンプルにしました。ボタンの色とその機能の画面の色を統一させて初めて使う方ができるだけ覚えやすいように工夫しました。


  
My時間割
![スクリーンショット 2024-09-18 3 13 46（2）](https://github.com/user-attachments/assets/1dfc735c-c749-4d5e-a7fa-def67c38f383)


![スクリーンショット 2024-09-18 3 17 31（2）](https://github.com/user-attachments/assets/b9d11b44-2190-4725-81f9-5679187a0a41)
編集モードでは　授業名が長いときに自分でわかるように短くしたり、曜日や時限を変更できます。  


検索機能
![スクリーンショット 2024-09-18 3 13 30（2）](https://github.com/user-attachments/assets/9fa10c38-5b6a-4d03-a6cf-59e731b0da4e)
見たい授業をいち早く検索できるように学年、学期、曜日などさまざまフィルター機能をつけました。


授業情報追加機能
![スクリーンショット 2024-09-18 3 26 05（2）](https://github.com/user-attachments/assets/a417c7bf-ff70-4a2f-94a8-91625face5cd)
検索時にもし目的の授業が見つからなかった場合にユーザーが新しく授業を追加することができます。授業のIDを入力するだけで、、 
  
  
![スクリーンショット 2024-09-18 3 26 14（2）](https://github.com/user-attachments/assets/945ca86d-5eb7-42bf-8379-39db06735e64)

このように授業の情報を取得することができます。
　　
　　

授業情報 & (課題など)共有画面
![スクリーンショット 2024-09-18 3 31 41（2）](https://github.com/user-attachments/assets/2e389656-f8f0-42f9-863b-dd07d99264c3)

各授業の詳細画面には授業の基本情報とユーザーが共有した課題などの情報を閲覧することができます。一人のユーザーが共有すれば他のユーザーがその課題の考え方を参考にすることができます。

  
  
共有管理画面
![スクリーンショット 2024-09-18 3 14 09（2）](https://github.com/user-attachments/assets/d027d019-534b-4567-9769-b7dcfe9bc3ab)
共有したユーザーはこの管理画面で自身が共有したものを管理することができます。かりにたくさん共有していても授業名や登録順で即座に絞り込むことができます。



以上がこのwebアプリの機能紹介となります。




