require("dotenv").config();
const express = require("express");
const axios = require("axios");
const QA = require("./QuestionsAnswers.js");
// const interaction = require('./interaction.js');
const app = express();
const myAPIKey = process.env.myAPIKey;
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3({apiVersion: '2006-03-01'});
// const multiparty = require('multiparty');
const data = require("./product.js");
const port = 3000;
const baseAPI = "https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/../client/public"));

// related product api request below //
// ========== api call start ========//

app.get("/products/:proID", (req, res) => {
  axios({
    method: "GET",
    url: baseAPI + req.url,
    headers: { Authorization: myAPIKey },
  })
    .then((prodInfo) => {
      // console.log('RESSS', req.url)
      res.send(prodInfo.data);
    })
    .catch((err) => res.status(400));
});

app.get("/products/:proID/related", (req, res) => {
  axios({
    method: "GET",
    url: baseAPI + req.url,
    headers: { Authorization: myAPIKey },
  })
    .then((relatedProdIDArray) => {
      res.send(relatedProdIDArray.data);
    })
    .catch((err) => res.status(400));
});

app.get("/products/:proID/styles", (req, res) => {
  axios({
    method: "GET",
    url: baseAPI + req.url,
    headers: { Authorization: myAPIKey },
  })
    .then((relatedProdIDStyles) => {
      // console.log('relatedProdIDStyles', relatedProdIDStyles);
      res.send(relatedProdIDStyles.data);
    })
    .catch((err) => res.status(400));
});
// ========== api calls end ========//

// API CALLS FOR RATINGS AND REVIEWS
app.get("/reviews", (req, res) => {
  const productId = req.query.productId;
  axios
    .get(
      `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews?product_id=${productId}`,
      {
        headers: {
          Authorization: myAPIKey,
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(404).send("error fetching reviews");
    });
});

app.get("/reviews/meta", (req, res) => {
  const productId = req.query.productId;
  axios
    .get(
      `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp/reviews/meta?product_id=${productId}`,
      {
        headers: {
          Authorization: myAPIKey,
        },
      }
    )
    .then((response) => {
      res.status(200).send(response.data);
    })
    .catch((err) => {
      res.status(404).send("error getting meta");
    });
});

/*
Routes for Questions API
*/

app.get("/questions", (req, res) => {
  QA.getQuestions(req.query.productId)
    .then((results) => {
      res.send(results);
    })
    .catch((error) => {
      res.status(500).send(error).end();
    });
});

app.post("/addQuestion", (req, res) => {
  QA.postQuestion(req.body)
    .then(() => {
      res.send("question was added");
    })
    .catch((error) => {
      res.status(500).send(error).end();
    });
});

app.post("/addAnswer", (req, res) => {
  QA.postAnswer(req.body)
    .then(() => {
      res.send("answer was added");
    })
    .catch((error) => {
      res.status(500).send(error).end();
    });
});

app.put("/questionHelpful", (req, res) => {
  QA.questionHelpful(req.body.questionId)
    .then(() => {
      res.send("helpful flag for question updated");
    })
    .catch((err) => {
      res.status(500).send(err).end();
    });
});

app.put("/answerHelpful", (req, res) => {
  QA.answerHelpful(req.body.answerId)
    .then(() => {
      res.send("helpful flag for answer updated");
    })
    .catch((err) => {
      res.status(500).send(err).end();
    });
});

app.put("/reportAnswer", (req, res) => {
  QA.reportAnswer(req.body.answerId)
    .then(() => {
      res.send("answer was reported");
    })
    .catch((err) => {
      res.status(500).send(err).end();
    });
});

/*
Route for Products API
*/

app.get("/products", (req, res) => {
  data.getProducts((err, data) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send(err);
    } else {
      // console.log(data);

      res.status(200);
      res.send(data);
    }
  });
});

app.post("/products/:product_id", (req, res) => {

  data.getProductInfo(req.body.params.productId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send(err);
    } else {

      res.status(200);
      res.send(data);
    }
  });
});

app.post("/products/:product_id/styles", (req, res) => {
  data.getProductStyles(req.body.params.productId, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send(err);
    } else {
      // console.log(data);
      res.status(200);
      res.send(data);
    }
  });
});

// app.get('/interaction', (req, res) => {
//   res.send('interaction was success');
// });

app.post("/interaction", (req, res) => {
  axios
    .post(`${baseAPI}/interactions`, req.body, {
      headers: {
        Authorization: myAPIKey,
      },
    })
    .then((res) => {
      // console.log('interaction successful', res.status, res.data);
      res.send(res.status).json({ dat: res.data });
    })
    .catch((err) => {
      res.send(err.status);
    });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
