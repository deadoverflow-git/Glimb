
const login = require("./utils/client");
const { request } = require("./utils/request");


  let data = await login("random_memes__daily", "super secret password");
  if (!data.authenticated) {
    console.log("wrong password or you have 2fa enabled!", data);
    return;
  }
  

