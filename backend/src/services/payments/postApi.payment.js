const express = require('express');
// const router = express.Router();
// module.exports = router;

const  PaystackResponse = {
  status: string;
  message: string;
  data: {
    access_code: string;
    authorization_url: string;
    reference: string;
  };
}