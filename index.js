const express = require("express");
const app = express();
const path = require("path");
const {google} = require("googleapis");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static("static"));
app.use(express.urlencoded({extended:true}));

const apiKey = "a5793a655935829acd4902e924e68f81"; 

// function to get dates for past 7 days
function getDatesPastTenDays() {
    const today = new Date(); // Current date and time
    const dates = [];
  
    for (let i = 1; i <=10; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - i);
      dates.push(currentDate.toISOString().split('T')[0]); // Push the date in 'YYYY-MM-DD' format
    }
  
    return dates;
}
// const historicalRates = await fetch(`http://api.exchangeratesapi.io/v1/2023-11-05?access_key=${apiKey}&base=EUR&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYN,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLE,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL`)
// const dataHistoricalRates = await historicalRates.json();
// const rateHistory = Object.values(dataHistoricalRates.rates); 

app.listen(1000,() => console.log("working on port 1000")); 

app.get("/", async (req,res) => {
    const list = await fetch(`http://api.exchangeratesapi.io/v1/symbols?access_key=a5793a655935829acd4902e924e68f81`);
    const data = await list.json();
    const keys = Object.keys(data.symbols);
    const values = Object.values(data.symbols);
    const valueRow = [];
    for( let i=0 ; i<values.length-1;i++){
        valueRow[i] = [values[i]];
    }
    const keyRow = [];
    for(let i=0; i<keys.length-1; i++){
        keyRow[i] = [keys[i]];
    }
    
    const listRates = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&base=EUR&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYN,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLE,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL`);
    const dataRates = await listRates.json();
    const valueRates = Object.values(dataRates.rates);
    const valueRatesRow = [];
    for ( let i = 0; i<valueRates.length; i++){
        valueRatesRow[i] = [valueRates[i]];
    }

    // dealing with rows of dates
    const tenDaysAgoDates = getDatesPastTenDays();
    const storageObject = {};
    for( let days of tenDaysAgoDates){
        const historicalRates = await fetch(`http://api.exchangeratesapi.io/v1/${days}?access_key=${apiKey}&base=EUR&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTC,BTN,BWP,BYN,BYR,BZD,CAD,CDF,CHF,CLF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LTL,LVL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLE,SLL,SOS,SRD,STD,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VES,VND,VUV,WST,XAF,XAG,XAU,XCD,XDR,XOF,XPF,YER,ZAR,ZMK,ZMW,ZWL`)
        const dataHistoricalRates = await historicalRates.json();
        const rateHistory = Object.values(dataHistoricalRates.rates);
        storageObject[days] = rateHistory;
    }
    // const dates = Object.keys(storageObject);
    const dateRow = [];
    for (let i=0; i<tenDaysAgoDates.length; i++){
        dateRow[i] = [tenDaysAgoDates[i]];
    }
    //historical values for the dates
    const historyValues = Object.values(storageObject);
        let historyValuesRow = [];
        for (let i=0 ; i<historyValues.length; i++){
            let subSub = [];
            let sub = historyValues[i];
            for (let j=0; j<sub.length; j++){
                subSub[j] = [sub[j]];
            }
            historyValuesRow[i] = subSub;
        };

    // getting spreadSheetId 
    const spreadSheetId = "1QY7tlqAgj22OoKwh4KiwcUPMBGw140NmLHSSjD6pdOQ";
    // storing authorization creds
    const auth = new google.auth.GoogleAuth({
        keyFile: "weatherprototype-403905-6c1d32ff92f0.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    
    // create client instance for auth
    const client = await auth.getClient();

    // Instance of google sheets API
    const googleSheets = google.sheets({
        version: "v4",
        auth: client,
    });
     //write data to row(s) of spreadSheet
     const symbol = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId: spreadSheetId,
        range: "currencyExchange!A3:A",
        valueInputOption:"USER_ENTERED",
        resource: {
            values:keyRow,
        }
    })
     const name = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId: spreadSheetId,
        range: "currencyExchange!B3:B",
        valueInputOption:"USER_ENTERED",
        resource: {
            values:valueRow,
        }
    })
    const value = await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId: spreadSheetId,
        range: "currencyExchange!C3:C",
        valueInputOption:"USER_ENTERED",
        resource: {
            values:valueRatesRow,
        }
    })
    
    let rowList = ['D','E','F','G',"H","I","J","K","L","M","N"]
    for (let i=0; i<rowList.length; i++){
        const dateRowUpdate = await googleSheets.spreadsheets.values.update({
            auth,
            spreadsheetId: spreadSheetId,
            range: `currencyExchange!${rowList[i]}2`,
            valueInputOption:"USER_ENTERED",
            resource: {
                values:[dateRow[i]],
            }
        })
    }
    for(let i = 0;i<rowList.length;i++){
        const historyValueRowUpdate = await googleSheets.spreadsheets.values.update({
            auth,
            spreadsheetId: spreadSheetId,
            range: `currencyExchange!${rowList[i]}3:${rowList[i]}`,
            valueInputOption:"USER_ENTERED",
            resource: {
                values:historyValuesRow[i],
            }
        })
    }
    res.render("app.ejs",{keys,values,valueRates,historyValues,tenDaysAgoDates})
})



// const supportedSymbolsList = async function() {
//     const list = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=a5793a655935829acd4902e924e68f81&symbols=USD,AUD,CAD,PLN,MXN&format=1`);
// }
// supportedSymbolsList();