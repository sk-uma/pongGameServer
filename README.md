# ft_transcendence_co

## 起動手順
1.database
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

2.serverside
seversideのディレクトリに移動
npm i -g @nestjs/cli
npm install --save axios typeorm@0.2.45 @nestjs/typeorm pg class-validator class-transformer bcrypt @nestjs/passport passport passport-jwt @nestjs/jwt
npm install @types/bcrypt @types/passport-jwt --save-dev
yarn start:dev でサーバー起動

3.frontend
yarn add react@17.0.2 react-dom@17.0.2 react-router-dom @types/react-router-dom @chakra-ui/react @chakra-ui/icons framer-motion@3.10.6 @emotion/react @emotion/styled
yarn start でサーバー起動

以上、実行後
localhost:3000 にアクセス
