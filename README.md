# gripInvest
Steps to run the APIs successfully :
1. Download the project folder into your system.
2. run npm install inside the folder 'gripInvest'.
3. change your database connections according to your credentials in 'server.js' file.
4. Use migrations to create tables OR you can directly copy create tables queries from migrations files and run.
5. Use POSTMAN to check apis response.
   1. check wallet balance: GET - http://localhost:3060/gripInvest/get
   2. ledger: GET - http://localhost:3060/gripInvest/ledger
   3. add amount to wallet: POST - http://localhost:3060/gripInvest/post
   4. withdraw amount: PUT - http://localhost:3060/gripInvest/put
   5. invest amount: POST - http://localhost:3060/gripInvest/invest
   6. send returns: POST - http://localhost:3060/gripInvest/returns
6. Enjoy!!
