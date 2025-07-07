## auhRouter
- POST /signup
- POST
- POST /Logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter
- GET /usar/connections
- GET /user/requests
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignored, interested, accepeted, rejected