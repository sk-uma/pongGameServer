# ft_transcendence_co

## 起動手順
## 1.database  
databaseディレクトリでdocker-compose up -d  
  
localhost:81でpgAdminにアクセス。  
E-mail:nestjs@example.com  
password:password  
でログイン  
  
Servers右クリック>Register>Server  
Generalタブ  
-Name:任意  
  
Connectionタブ  
-Host:postgres  
-Port:5432  
-Username:postgres  
-Password:postgres  
でServer作成  
  
作成したServerを展開  
Databases右クリック>Create>Database  
Generalタブ  
-Database:backend_db  
でDatabase作成  
  
## 2.serverside  
seversideのディレクトリに移動  
npm i -g @nestjs/cli(既にインストールされている場合必要なし。初回だけでOK)  

npm install  

npm run start:dev でサーバー起動(PORT3001)  
  
## 3.frontend  
npm install --legacy-peer-deps  
(現状モジュール間でコンフリクトあるため、オプション必要)  

npm run start でサーバー起動(PORT3000)  
  
以上、実行後  
localhost:3000 にアクセス  
