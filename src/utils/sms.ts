require('dotenv').config()
const XMLHttpRequestt = require('xhr2')

export default function sendSms(phone:string,message:string){
    try{
        require("dotenv").config();
        const request = new XMLHttpRequestt();

        request.open("POST", "https://api.wittyflow.com/v1/messages/send");
    
        request.setRequestHeader("Content-Type", "application/json");

        request.onreadystatechange = function () {
            if (this.readyState === 4) {
              console.log("Status:", this.status);
              console.log("Headers:", this.getAllResponseHeaders());
              console.log("Body:", this.responseText);
            }
          };
      
          const body = {
            from: "CAB_APP",
            to: `${phone}`,
            type: "1", // <!-- use 0 for flash sms and 1 for plain sms -->
            message: message,
            app_id: process.env.APP_ID,
            app_secret:process.env.APP_SECRET,
          };
      
          request.send(JSON.stringify(body));
    }catch(e){
        throw e
    }
}