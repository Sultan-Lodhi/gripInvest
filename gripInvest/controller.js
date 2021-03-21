/***************** @creator : @SultanLodhi ********************/
module.exports = {
    checkWalletBalance,
    getLedger,
    addAmountToWallet,
    withdrawAmount,
    investAmount,
    sendReturnsToWallet
}
const CURRENT_DATE_TIME = new Date().toISOString().slice(0, 10); // convrerting datetime into date format - yyyy-mm-dd

/*
 * Function/API Name: checkWalletBalance()
 * Usage: getting wallet balance of a particular user
 * req.body should contains keys : 'user_id'
 */
async function checkWalletBalance(req,res){
    try{
        let query = "SELECT wallet_balance FROM users WHERE user_id = "+ req.body.user_id;
        let data = [];
        await db.query(query, (err, result) => {
            if (err) throw err;
            data = Object.values(JSON.parse(JSON.stringify(result)));
            sendJson(res, data[0], false, 'Wallet balance fetched successfully', 200, 1);
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Listing failed!', 406);
    }
}
/*
 * Function/API Name: getLedger()
 * Usage: getting transaction history of a particular user
 * req.body should contains keys : 'user_id'
 */
async function getLedger(req,res){
    try{
        let query = "SELECT amount, CASE WHEN transaction_type = 1 THEN 'Amount Withdrawal' WHEN transaction_type = 2 THEN 'Amount Invested' ELSE 'Returns To Wallet' END AS typeOfTransaction, DATE_FORMAT(transaction_date,'%D %b %Y') as transactionDate FROM transactions_log WHERE fk_user_id = "+ req.body.user_id;
        let data = [];
        await db.query(query, (err, result) => {
            if (err) throw err;
            data = Object.values(JSON.parse(JSON.stringify(result)));
            sendJson(res, data, false, 'Transactions History fetched successfully', 200, 1);
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Listing failed!', 406);
    }
}
/*
 * Function/API Name: addAmountToWallet()
 * Usage: Adding/Updating amount into wallet on the basis of user email id
 * req.body should contains keys- For Update Case : 'email','amount'
 *          for New entry/ insert case: 'name','email','amount'
 */
async function addAmountToWallet(req,res){
    try{
        let query = "SELECT * FROM users WHERE email = '"+ req.body.email+"'";
        let data = [];
        await db.query(query, (err, result) => {
            if (err) throw err;
            data = Object.values(JSON.parse(JSON.stringify(result)));
            if(data.length){ // if user already exists then update the amount only
                let update = [{ wallet_balance: data[0].wallet_balance + parseFloat(req.body.amount) }, req.body.email];
                db.query('UPDATE users SET ? WHERE email = ?', update, (err, result) => {
                    if (err) throw err;
                    sendJson(res, { data: 1}, false, 'Wallet balance Updated successfully', 200, 1);
                });
            }
            else { // if new user then add new entry to user table
                let insertData = {name: req.body.name, email: req.body.email, wallet_balance: req.body.amount, creation_date: CURRENT_DATE_TIME};
                db.query('INSERT INTO users SET ?', insertData, (err, result) => {
                    if (err) throw err;
                    sendJson(res, {data:1}, false, 'Amount added to Wallet successfully', 200, 1);
                });
            }
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Insertion/Update failed!', 406);
    }
}
/*
 * Function/API Name: withdrawAmount()
 * Usage: Withdraw amount - updating tables 'users', 'transactions_logs'
 * req.body should contains keys : 'amount','user_id'
 */
async function withdrawAmount(req,res){
    try{
        let update = [req.body.amount, req.body.user_id];
        db.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE user_id = ?', update, async (err, result) => {
            if (err) throw err;
            /* After successfull withdrawal adding entry in transactions_log table */
            let insertData = {fk_user_id: req.body.user_id, transaction_type: 1, amount: req.body.amount, transaction_date: CURRENT_DATE_TIME};
            console.log(insertData);
            await db.query('INSERT INTO transactions_log SET ?', insertData, (err, result) => {
                if (err) throw err;
            });
            sendJson(res, { data: 1}, false, 'Amount withdrwal successfully', 200, 1);
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Update failed!', 406);
    }
}
/*
 * Function/API Name: investAmount()
 * Usage: Invest amount - updating tables 'users', 'transactions_logs' and
 *        investment_returns
 * req.body should contains keys : 'amount','user_id','rate','time'.
 */
async function investAmount(req,res){
    try{
        let update = [req.body.amount, req.body.user_id];
        db.query('UPDATE users SET wallet_balance = wallet_balance - ? WHERE user_id = ?', update, async (err, result) => {
            if (err) throw err;
            /* After successfull deduction adding entry in transactions_log table */
            let insertData = {fk_user_id: req.body.user_id, transaction_type: 2, amount: req.body.amount, transaction_date: CURRENT_DATE_TIME};
            await db.query('INSERT INTO transactions_log SET ?', insertData, (err, result) => {
                if (err) throw err;
            });
            /* Adding entry in investment_returns table */
            let interest = interestOnInvestment(req.body.amount,req.body.time,req.body.rate);
            let investData = {fk_user_id: req.body.user_id, amount: req.body.amount, rate: req.body.rate, time: req.body.time, interest: interest, creation_date: CURRENT_DATE_TIME};
            await db.query('INSERT INTO investment_returns SET ?', investData, (err, result) => {
                if (err) throw err;
            });
            sendJson(res, { data: 1}, false, 'Amount invested successfully', 200, 1);
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Update failed!', 406);
    }
}
/*
 * Function/API Name: sendReturnsToWallet()
 * Usage: Invest amount - getting total returns from investment_returns and updating
 *        tables 'users', 'transactions_logs'
 * req.body should contains keys : 'user_id'
 */
async function sendReturnsToWallet(req,res){
    try{
        let query = "SELECT sum(interest) as totalReturn FROM investment_returns WHERE fk_user_id = "+ req.body.user_id+" GROUP BY fk_user_id";
        let data = [];
        await db.query(query, (err, result) => {
            if (err) throw err;
            data = Object.values(JSON.parse(JSON.stringify(result)));
            let update = [data[0].totalReturn, req.body.user_id];
            db.query('UPDATE users SET wallet_balance = wallet_balance + ? WHERE user_id = ?', update, async (err, result) => {
            if (err) throw err;
                /* After successfull returns adding entry in transactions_log table */
                let insertData = {fk_user_id: req.body.user_id, transaction_type: 3, amount: data[0].totalReturn, transaction_date: CURRENT_DATE_TIME};
                await db.query('INSERT INTO transactions_log SET ?', insertData, (err, result) => {
                    if (err) throw err;
                });
            });
            sendJson(res, { data: 1}, false, 'returns sent to wallet successfully', 200, 1);
        });
    }
    catch(err){
        console.log(err);
        sendJson(res, err, true, 'Update failed!', 406);
    }
}
/*
 * Function Name: sendJson()
 * Usage: Sending backend data to front in a particular json format
 */
function sendJson(res, data, error, message, statusCode) {
    return res.json({
        data,
        error,
        message,
        statusCode
    });
}
/*
 * Function Name: interestOnInvestment()
 * Usage: Function to calculate interest on investments
 * Argumets: p- amount invested, t- time, r- rate of interest
 * Assumptions: Assuming compund interest to be calculated annually and time in years
 */
function interestOnInvestment(p, t, r){
    let amount = p * (Math.pow((1 + (r / 100)), t));
    let interest = amount - p;
    return interest.toFixed(2);
 };