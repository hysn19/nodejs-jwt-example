# 프로젝트 설정

`npm -y init`

```json
{
  "name": "nodejs-jwt-example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

# 의존(dependency) 모듈 설치

`npm install --save express body-parser jsonwebtoken mongoose morgan`

- express: 저희 프로젝트에서 사용 할 웹서버 프레임워크입니다.
- body-parser: 클라이언트측에서 요청을 받을때, url-encoded 쿼리 및 json 형태의 바디를 파싱하는데 도움을 주는 모듈입니다.
- jsonwebtoken: 이 예제프로젝트에서 사용되는 핵심 모듈입니다. JSON Web Token 을 손쉽게 생성하고, 또 검증도 해줍니다.
- mongoose: 서버에서 MongoDB 를 사용하기 위하여 설치합니다.
- morgan: Express 서버에서 발생하는 이벤트들을 기록해주는 미들웨어입니다

```json
{
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "jsonwebtoken": "^7.1.9",
    "mongoose": "^4.7.1",
    "morgan": "^1.7.0"
  }
}
```

> 문법 검사를 위하여 ESLint 를 사용하고있습니다. 위 프로젝트의 ESLint 설정 파일의 내용은 여기서 확인할수있습니다. ESLint 를 설정하는건 필수는 아닙니다. 사용을 원하시는 분들은 .eslintrc 파일을 생성하시고 npm 으로 ESlint 를 설치하세요
> `npm install --save-dev eslint`

## user 스키마 작성하기

> models/user.js

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  username: String,
  password: String,
  admin: { type: Boolean, default: false }
})

// create new User document
User.statics.create = function(username, password) {
  const user = new this({
    username,
    password
  })

  // return the Promise
  return user.save()
}

// find one user by using username
User.statics.findOneByUsername = function(username) {
  return this.findOne({
    username
  }).exec()
}

// verify the password of the User documment
User.methods.verify = function(password) {
  return this.password === password
}

User.methods.assignAdmin = function() {
  this.admin = true
  return this.save()
}

module.exports = mongoose.model('User', User)
```
