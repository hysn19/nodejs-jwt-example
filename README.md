# 프로젝트 설정

[사이트](https://velopert.com/2448)

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

- create 메소드는 새 유저를 생성합니다. 원래는 이 메소드처럼 비밀번호를 그대로 문자열 형태로 저장하면 보안적으로 매우 나쁩니다. 일단 지금은 배우는 과정이니 간단하게 문자열로 저장을 하지만, 포스트의 후반부에서는 비밀번호를 해쉬하여 저장하도록 하겠습니다
- findOneByUsername 메소드는 username 값을 사용하여 유저를 찾습니다
- verify 메소드는 비밀번호가 정확한지 확인을 합니다. 지금은 그냥 === 를 사용해서 비교 후 결과를 반환하지만 포스트 후반부에서는 해쉬를 확인하여 결과를 반환하겠습니다
- assignAdmin 메소드는 유저를 관리자 계정으로 설정해줍니다. 저희 예제 프로젝트에서는, 가장 처음으로 가입한 사람과, 관리자가 나중에 API 를 사용하여 지정한사람이 관리자 권한을 부여 받습니다.

## mongodb

> mongodb 설정은 생략

## config.js 작성하기

> config.js

- mongodb는 mlab으로 호스팅하여 사용함.

```js
module.exports = {
  secret: 'SeCrEtKeYfOrHaShInG',
  mongodbUri: 'mongodb://velopert:password@ds127428.mlab.com:27428/jwt-tutorial'
}
```

## 서버코드 작성하기

> app.js

```javascript
/* =======================
    LOAD THE DEPENDENCIES
==========================*/
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

/* =======================
    LOAD THE CONFIG
==========================*/
const config = require('./config')
const port = process.env.PORT || 3000

/* =======================
    EXPRESS CONFIGURATION
==========================*/
const app = express()

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// print the request log on console
app.use(morgan('dev'))

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

// index page, just for testing
app.get('/', (req, res) => {
  res.send('Hello JWT')
})

// open the server
app.listen(port, () => {
  console.log(`Express is running on port ${port}`)
})

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
mongoose.connect(config.mongodbUri)
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => {
  console.log('connected to mongodb server')
})
```

```
> node app.js
Express is running on port 3000
connected to mongodb server
```
