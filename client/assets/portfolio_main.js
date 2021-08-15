
const formyahoo = document.querySelector('#yahoo-form');
const addInvestmentform = document.querySelector('#addInvestmentform');

// Bind Event Listeners
formyahoo.addEventListener('submit', searchstock);
addInvestmentform.addEventListener('submit', sendbuy)

function replaceName() {
let sect = document.getElementById('usernameTop')
if (localStorage.username && localStorage.username !== "undefined"){
sect.textContent = 'Hi ' + localStorage.username + '!'}}
replaceName()

function searchstock(e) {
    e.preventDefault(); //Stops page reloading
    let ticker = e.target.StockTickersearch.value
    let url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?symbol=${ticker}&region=US`
    console.log(url)
    fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "d5f69dd810msh69699f52c9e3a85p16f184jsn9ac2dae6c00f",
            "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
    })
        .then(response => response.json())
        .then(content => {
            document.querySelector("#Stock-Ticker").value = content.symbol
            document.querySelector("#Name").value = content.quoteType.longName
            document.querySelector("#Sector").value = content.summaryProfile.sector
            document.querySelector("#sharePrice").value = content.financialData.currentPrice.raw
            document.querySelector("#StockTickersearch").value = ""
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-' + dd;
            document.querySelector("#Dateform").value = today
        })
        .catch(err => { console.error(err) })

}

function logout(){
    localStorage.clear();
    window.location = "./index.html";
}

document.addEventListener('DOMContentLoaded', showPortfolio);

function createTable(id, data){

    let table = document.getElementById(id);
    table.innerHTML = '';
    let row = document.createElement('tr');


    for(invest of data){
        row = document.createElement('tr');
        row.setAttribute('id', invest.id);
        row.className= 'bg-indigo-50';

        //base
        let ticker = document.createElement('td');
        ticker.innerText= invest.ticker;
        
        let num_shared = document.createElement('td');
        num_shared.innerText= Number(invest.num_shares).toFixed(2);


        let buy_level = document.createElement('td');
        buy_level.innerText= Number(invest.buy_level).toFixed(2);
        buy_level.className = 'p-1';

        let fee = document.createElement('td');
        fee.innerText= Number(invest.fee).toFixed(2);
        fee.className = 'p-1';

        let date = document.createElement('td');
        date.innerText= new Date(invest.date_of_purchase).toLocaleDateString('en-GB');
        date.className = 'p-1';

        //Fetched externally // needs and external function or something
        let name = document.createElement('td');
        name.innerText= invest.name;

        let sectorCell = document.createElement('td');
        sectorCell.className='p-3 font-bold';
        let sector = document.createElement('span');
        sector.className = 'bg-green-400 text-gray-50 rounded-full px-3 py-1';
        sector.innerText= invest.sector;;
        sectorCell.append(sector);

        let actual_price = document.createElement('td');
        actual_price.innerText= Number(invest.stored_price).toFixed(2);
        actual_price.className = 'p-1';

        //calulated
        

        let transaction_cost = document.createElement('td');
        transaction_cost.innerText= (Number(invest.buy_level)*Number(invest.num_shares)).toFixed(2);
        transaction_cost.className = 'p-3';

        let total_cost = document.createElement('td');
        total_cost.innerText= (Number(transaction_cost.innerText)*Number(invest.fee)).toFixed(2);
        total_cost.className = 'p-1';
        
        let retnCell = document.createElement('td');
        retnCell.className = 'p-1';
        let div1=document.createElement('div');
        div1.className='flex align-items-center';
        let div2=document.createElement('div');
        div2.className = 'ml-3';
        let topDiv=document.createElement('div');
        topDiv.innerText = Number(invest.stored_price)*Number(invest.num_shares)-Number(total_cost.innerText);
        let bottomDiv=document.createElement('bottom');
        bottomDiv.innerText = (Number(total_cost.innerText)*100/Number(topDiv.innerText)).toFixed(2)+ '%';

    
        div2.append(topDiv);
        div2.append(bottomDiv);
        div1.append(div2);
        retnCell.append(div1);

        row.append(ticker);
        row.append(name);
        row.append(sectorCell);
        row.append(fee);
        row.append(transaction_cost);
        row.append(total_cost);
        row.append(buy_level);         
        row.append(num_shared);
        row.append(actual_price);
        row.append(retnCell);
        row.append(date);

        if(id=='holdings'){
            let cellButton = document.createElement('td');
            let button = document.createElement('button');            
            button.setAttribute('href',"/#sell/"+invest.id);
            button.addEventListener("click", function(){
                changeHolding(invest.id);
            })
            button.className = 'holdingButt p-2';
            
            let img = document.createElement('img');
            img.setAttribute('src','assets/shuttle.svg');
            img.setAttribute('width','27');
            button.append(img);
            cellButton.append(button);
            row.append(cellButton);

        }else if(id=='pastHoldings'){
            let cellButton = document.createElement('td');
            let button = document.createElement('button');
            button.addEventListener("click", function(){
                deletePastHolding(invest.id);
            })            
            button.className = 'pastHoldingButt p-2';
            
            let img = document.createElement('img');
            img.setAttribute('src','assets/garbage.svg');
            img.setAttribute('width','27');
            button.append(img);
            cellButton.append(button);
            row.append(cellButton);;
        }
        
        table.append(row);
    }
}

function updateMain(data){  
    if(!!data.buys.length>0) {createTable('holdings', data.buys)};
    if(!!data.sells.length>0){createTable('pastHoldings', data.sells)};
}

async function showPortfolio(){
    try{
        const data = await getAll();
        console.log(data);
        if (!data) {throw new Error('Problem in the database')}
        updateMain(data);
    }catch(e){
        console.log(e);
        logout();
    }
}

const url = 'http://localhost:5000/'
async function getAll(){
    try {
        const options = { headers: new Headers({'token': localStorage.getItem('token')}) }
        console.log(localStorage.getItem('userid'))
        const response = await fetch(`${url}users/${localStorage.getItem('userid')}`, options);
        const data = await response.json();
        if(data.err){
            console.warn(data.err);
            //data = portfolioData;
            //doLogout(); //activate when not testing
            console.log(data)
        }
        return data;
    } catch (err) {
        console.warn(err);
        return portfolioData;
    }
}

async function sendbuy(e){
    e.preventDefault();

    let bodyData = Object.fromEntries(new FormData(e.target));
    bodyData.user_id = localStorage.getItem('userid');
    try {
        const options = {
            headers: new Headers({'token': localStorage.getItem('token')}),
            method: 'POST',
            body: JSON.stringify(bodyData)
        };
        console.log(options);
        const r = await fetch(`http://localhost:5000/buys`, options);
        const data = await r.json();
        if (data.err){ throw Error(data.err) };
        removehash();
    } catch (err) {
        console.warn(err);
    }

}
function removehash() {
    let destination = window.location.href.substr(0, window.location.href.indexOf('#'))
    window.location.href = destination;
    }