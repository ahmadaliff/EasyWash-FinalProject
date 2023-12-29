# Backend EasyWash

Express.js project with basic routes:

- Express
- Joi
- Cors
- Bcrypt
- CryptoJS
- jsonwebtoken
- multer
- sequelize
- sequelize-cli
- nodemailer
- dotEnv
- mysql2
- stream-chat
- ioRedis
- midTrans
- googleapis
- cookie-parser
- socket.io

---

## Program flow

![Program Flow](../media/programFlow.png)

## URL

_Server_

```
http://localhost:5000
```

## Run Server

_Server_

```
"npm start" or "node index.js" or "nodemon index.js"

```

---

## ENV FILE

change .env.example to .env

```
NODE_ENV=development
APP_PORT=5000

MAX_ATTEMPTS_LOGIN=3
ATTEMPTS_EXPIRE=2*60

SECRET_KEY=rahasia
SECRET_KEY_REFRESH=rasda
SECRET_KEY_VERIFY_EMAIL=rasda
SECRET_KEY_FOR_FORGET_PASSWORD=sangatrahasia
CRYPTOJS_SECRET=rahasiabanget

MIDTRANS_SERVER_KEY=your midtrans server key
MIDTRANS_CLIENT_KEY=your midtrans client key

STREAM_KEY=stream key
STREAM_SECRET=stream secret

MY_EMAIL=email
EMAIL_PASSWORD="password"

CLIENT_URL=http://localhost:3000/
CLIENT_HOST=http://localhost:3000
SERVER_HOST=http://localhost:5000/

GOOGLE_CLIENT_ID=your google credential client id
GOOGLE_CLIENT_SECRET=your google credential client secret
GOOGLE_REDIRECT_URL=http://localhost:3000/callback

```

---

## Global Response

_Response (500 - Internal Server Error)_

```
{
  "message": "Internal Server Error"
}
```

_Response (401 - Unathourize)_

```
{
  "message": "app_unathorize_auto"
}
```

_Response (403 - forbidden)_

```
"Forbidden"
```

_Response (404 - not found)_

```
{
  "message": "app_404"
}
```

---

# RESTful endpoints

## AUTH ROUTE

### 1. POST /api/auth/login

> login

_Request Header_

```
not needed
```

_Request Body_

```
{
    "email":email,
    "password":password
}
```

_Response (200)_

```
{
    "token": "jwt access token",
    "message": "app_login_success"
}
```

_response(400,bad request)_

```
{
    "message": `app_login_max_attemps`
}

```

_response(400,bad request)_

```
{
    "message": `app_login_invalid`
}

```

_response(400,bad request)_

```
{
    "message": `app_login_not_verify`
}

```

---

### 2. GET /api/auth/google

> get link login with google

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "Location": "link google generated with googleapis library"
}
```

---

### 3. POST /api/auth/google/data

> get data profile google with code

_Request Header_

```
not needed
```

_Request Body_

```
{
    "code": "code from callback google"
}
```

_Response (200)_

```
{
    "imagePath": "./blabla.png",
    "token":"jwt access token",
    "message": "app_login_success",
}
or
{
    "imagePath": "image link from google",
    "token":"jwt access token",
    "message": "app_login_success",
    "created": "app_user_created_check_email",
}
```

_response(400,bad request)_

```
{
    "message": `app_login_failed`
}

```

---

### 4. POST /api/auth/register

> register

_Request Header_

```
not needed
```

_Request Body_

```
{
    "fullName": "string",
    "email": "string",
    "phone": "number",
    "password": "encrypted string",
    "role": "user"
}
or
{
    "fullName": "string",
    "email": "string",
    "phone": "number",
    "password": "encrypted string",
    "role": "merchant"
    "merchant":"{"name":"string","description":"string","location":"{"lat":"-3","lng":"3"}"}"
}
```

_Response (200)_

```
{
      "data": data response object,
      "message": `app_register_success_laundry`
}
or
{
      "data": data response object,
      "message": `app_register_success`,
}
```

_Response (400 bad request)_

```
{
    "message": "app_register_already_exist",
}
```

---

### 5. POST /api/auth/verifyEmail

> Verify email

_Request Header_

```
Bearer Token
```

_Request Body_

```
{email:email}
```

_Response (200)_

```
{ message: "app_verify_email_otp_send" }
```

_Response (400, bad request)_

```
 {message:"app_register_already_exist"}

```

_Response (400, bad request)_

```
 {message:"app_verify_email_otp_failed"}

```

### 6. POST /api/auth/checkOtpVerifyEmail

> set Verify email true

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "otp":"number",
    "token":"token"
}
```

_Response (200)_

```
{ message: "app_verify" }
```

_Response (400, bad request)_

```
 {message:"app_register_already_exist"}

```

_Response (400, bad request)_

```
 {message:"app_verify_email_otp_invalid"}

```

---

### 7. POST /api/auth/forgotPassword

> forgot password

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email":"string"
}
```

_Response (200)_

```
{
 message: "app_forgot_password_email_sent",
}
```

_Response (400, bad request)_

```
 {message:"app_forgot_password_email_failed"}

```

---

### 8. PUT /api/auth/resetPassword/

> set password with new password

_Request Params_

```
not needed
```

_Request Header_

```
bearer token
```

_Request Body_

```
{
    "token":"token",
    "new_password":"string"
}
```

_Response (200)_

```
{
    message:"app_reset_password_success",
}
```

---

### 9. GET /api/auth/refresh

> get refresh token

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Request Cookie_

```
refreshToken
```

_Response (200)_

```
{
    "token": "new access token",
}
```

_Response (401,bad request)_

```
{
    "message": "app_session_expired",
}
```

---

### 10. POST /api/auth/logout

> logout

_Request Header_

```
not needed
```

_Request Body_

```
{
    "id": number
}
```

_Response (200)_

```
{
    "message": "app_logout_success",
}
```

---

### 11. GET /api/auth/profile

> get my profile

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needer
```

_Response (200)_

```
{
    "data":{
        "fullName":"string",
        "imagePath":"string",
        "role":"string",
        "phone":"number"
    }
    "message": "success",
}
```

---

### 12. PUT /api/auth/edit/photoProfile

> edit photo profile

_Request Header_

```
bearer token
Content-Type : multipart/form-data
```

_Request Body_

```
image:"Files"
```

_Response (200)_

```
{
    "data":{
        "fullName":"string",
        "imagePath":"string",
        "role":"string",
        "phone":"number"
    }
    "message": "app_edit_photo_profile_success",
}
```

---

### 13. PUT /api/auth/edit/profile

> edit profile

_Request Header_

```
bearer token
```

_Request Body_

```{
    "fullName":"string",
    "phone":"number",
    "old_password":"encrypted string",
    "new_password":"encrypted string"
}
```

_Response (200)_

```
{
    "data":{
        "fullName":"string",
        "imagePath":"string",
        "role":"string",
        "phone":"number"
    }
    "message": "app_edit_profile_success",
}
```

_Response (400,bad request)_

```
{
    "message": "app_edit_profile_pass_invalid",
}
```

---

## ADMIN ROUTE

### 14. GET /api/admin/users

> get users verified

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Query_

```
page = number
limit = number
search = "string"
```

_Response (200)_

```{

    data: [array of users],
    totalPage: "number",
    totalRows: "number",
}
```

---

### 15. GET /api/admin/users/unverified

> get users unverified

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Query_

```
page = number
limit = number
search = "string"
```

_Response (200)_

```{

    data: [array of users],
    totalPage: "number",
    totalRows: "number",
}
```

---

### 16. DELETE /api/user/delete

> delete user or decline user(deleted when decline)

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    id:2
}
```

_Response (200)_

```
{
    "message":"app_user_deleted"
}
or
{
    "message":"app_user_decline"
}
```

---

### 17. PUT /api/user/verify

> verify user

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    id:2
}
```

_Response (200)_

```
{
    "message":"app_account_verified"
}
```

---

## LAUNDRY/MERCHANT ROUTE

### 18. GET /api/laundry/services

> GET laundry services

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Query_

```
page = number
limit = number
search = "string"
```

_Response (200)_

```
{
    "data":[{name,isUnit,price},{name,isUnit,price},...]
    "message":"app_account_verified"
}
```

---

### 19. POST /api/laundry/service/add

> Add service

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "name": "string",
    "price": number,
    "isUnit": bool
}
```

_Response (201)_

```
{
    "message":"app_service_created"
}
```

_Response (400, bad request)_

```
{
    "message":"app_service_already_exist"
}
```

---

### 20. PUT /api/laundry/service/edit/:serviceId

> edit service

_Request Header_

```
Bearer Token
```

_Request Params_

```
serviceId
```

_Request Body_

```
{
    "name": "string",
    "price": number,
    "isUnit": bool
}
```

_Response (200)_

```
{
    "message":"app_service_updated"
}
```

---

### 21. DELETE /api/laundry/service/delete/:serviceId

> delete service

_Request Header_

```
Bearer Token
```

_Request Params_

```
serviceId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message":"app_service_deleted"
}
```

---

### 22. GET /api/laundry/service/:serviceId

> Get service

_Request Header_

```
Bearer Token
```

_Request Params_

```
serviceId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data":{
    "name": "string",
    "price": number,
    "isUnit": bool
    }
}
```

---

### 23. GET /api/laundry/orders

> Get orders

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Query_

```
page = number
limit = number
search = "string"
```

_Response (200)_

```
{

    "data":[{id,user_id,...},...],
    "totalPage": number,
    "totalRows": number,
}
```

---

### 24. PATCH /api/laundry/order/changeStatus

> change status order

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "orderId":number,
    "newStatus":string
}
```

_Response (200)_

```
{

"message":"app_status_updated"

}
```

---

### 25. GET /api/laundry/my

> Get my laundry

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Response (200)_

```
{

"data":{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
}
```

---

### 26. PUT /api/laundry/edit

> edit merchant info

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "name":"string",
    "desc":"string",
}
```

_Response (200)_

```
{
"message": "app_updated_merchant"
"data":{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
}
}
```

---

### 27. PATCH /api/laundry/changePhoto

> edit photo merchant

_Request Header_

```
Bearer Token
Content-Type : multipart/form-data
```

_Request Body_

```
image
```

_Response (200)_

```
{
"message": "app_updated_merchant_photo"
"data":{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
}
}
```

---

## USER ROUTE

### 28. POST /api/user/merchant

> get all merchant in range 3km by user location

_Request Header_

```
not needed
```

_Request Body_

```
{
    "location":stringfy object
}
```

_Response (200)_

```
{
"data":[{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
    "distance":"string"
},...]
}
```

---

### 29. POST /api/user/detail/merchant/:merchantId

> get merchant by id in range 3km by user location

_Request Header_

```
Bearer Token
```

_Request Params_

```
merchantId
```

_Request Body_

```
{
    "location":stringfy object
}
```

_Response (200)_

```
{
"data":{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
    "distance":"string"
}
}
```

---

### 30. GET /api/user/favorit

> get all favorit merchant

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
"data":{
    "name":"string",
    "desc":"string",
    "imagePath":"string",
    "distance":"string"
}
}
```

---

### 31. POST /api/user/favorit/add/:merchantId

> add merchant to favorit

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Params_

```
merchantId
```

_Response (201)_

```
{
    "message":"app_success_add_to_fav"
}
```

_Response (400,bad request)_

```
{
    "message":"app_success_already_fav"
}
```

---

### 32. DELETE /api/user/favorit/delete/:merchantId

> add merchant to favorit

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Params_

```
merchantId
```

_Response (200)_

```
{
    "message":"app_success_delete_from_fav"
}
```

---

### 33. GET /api/user/cart

> get cart

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data":{
        "serviceId":string,
        "userId":"string",
        "quantity":number
    }
}
```

---

### 34. POST /api/user/cart/add

> add to cart

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "serviceId":string,
    "quantity":number
}
```

_Response (200)_

```
{
    "data":{
        "serviceId":string,
        "userId":"string",
        "quantity":number
    }
    "message":"app_success_add_to_cart"
}
```

---

### 35. PUT /api/user/cart/updateQuantity

> update cart quantity

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "serviceId":string,
    "quantity":number
}
```

_Response (200)_

```
{
    "data":{
        "serviceId":string,
        "userId":"string",
        "quantity":number
    }
}
```

---

### 36. DELETE /api/user/cart/delete/:cartId

> delete from cart

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Params_

```
cartId
```

_Response (200)_

```
{
    "message":"app_success_delete_from_cart"
}
```

---

### 37. GET /api/user/orders

> get my orders

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data":[{"id","userId",...}]
}
```

---

### 38. POST /api/user/order/add

### 39. DELETE /api/user/order/cancel/:orderId

> get my orders

_Request Header_

```
Bearer Token
```

_Request Params_

```
orderId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message":"app_cancel_order_success"
}
```

_Response (400 bad request)_

```
{
    "message":"app_cannot_cancel_order"
}
```

---

### 40. GET /api/user/order/:orderId

> get my order by id

_Request Header_

```
Bearer Token
```

_Request Params_

```
orderId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "data":{"id","userId",...}
}
```

_Response (400 bad request)_

```
{
    "message":"app_cannot_cancel_order"
}
```

---

### 41. GET /api/user/midtransToken/:orderId

> get my orders

_Request Header_

```
Bearer Token
```

_Request Params_

```
orderId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "token":"token"
}
```

---

### 42. PUT /api/user/changeStatusPayment/:orderId

> change status payment

_Request Header_

```
Bearer Token
```

_Request Params_

```
orderId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message":"app_status_updated"
}
```

---

### 43. GET /api/user/status/midtrans/:orderId

> get my orders

_Request Header_

```
Bearer Token
```

_Request Params_

```
orderId
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
}
```

---

## MESSAGE ROUTE

### 44. GET /api/chat/token

> get stream chat token

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "token": "token from stream",
}
```

---

### 45. POST /api/chat/createChannel

> create streamchat channel

_Request Header_

```
Bearer Token
```

_Request Body_

```
{
    "userId":"1"
}
```

_Response (200)_

```
{ message: "app_chat_created" }
```

---

### 46. DELETE /api/chat/delete/:userId

> delete chat channel

_Request Header_

```
Bearer Token
```

_Request Body_

```
not needed
```

_Request Param_

```
userId = 1
```

_Response (200)_

```
{
    "message":"deleted channel"
}
```

---
