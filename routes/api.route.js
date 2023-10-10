const router = require("express").Router();
const { google } = require("googleapis");
const { calendar } = require("googleapis/build/src/apis/calendar");

const GOOGLE_CLIENT_ID =
  "310119139633-r4nlnm7h2prt1clj4tn67j1f5ft07sm6.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
var REFRESH_TOKEN = "";
var CLIENT_EMAIL = ''
var id_token = ''
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.post("/craete-tokens", async (req, res, next) => {
  try {
    const { code } = req.body;
    //const {data} = code
    const response = await oauth2Client.getToken(code);
    REFRESH_TOKEN = response.tokens.refresh_token;
    id_token = response.tokens.id_token
    console.log(REFRESH_TOKEN);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", async (req, res, next) => {
  try {
    const { summary, description, location, startDateTime, endDateTime } =
      req.body;
    oauth2Client.setCredentials({
      refresh_token: REFRESH_TOKEN,
    });
    const calendar = google.calendar("v3");
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: {
        summary : summary,
        description : description,
        location : location,
        colorId : '6',
        start : {
          dateTime : new Date(startDateTime)
        },
        end : {
          dateTime : new Date(endDateTime)
        }
      },
    });
    res.send(response);
  } catch (error) {
    next(error);
  }
});


router.get('/get-events',async (req,res,next)=>{
 try {
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
  const calendar = google.calendar("v3");
  const response = await calendar.events.list({
    auth : oauth2Client,
    calendarId : "sauravdhaka2001@gmail.com",
    timeMin : (new Date()).toISOString(),
    maxResults:10,
    singleEvents : true,
    orderBy : 'startTime'
  })
  res.send(response.data.items)

 } catch (error) {
  next(error)
 }
})


// router.get('/user/profile',(req,res,next)=>{
//   try {
//     res.send(id_token)
//   } catch (error) {
//     next(error)
//   }
// })


module.exports = router;
