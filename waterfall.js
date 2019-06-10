const http = require("http"); //Package used to make http request
const async = require("async"); //Package used for async operation handling
const fs = require("fs"); //Package used for fs access

//This callback will be used for opening the file we get from the process arg
//next is the callback to run next in the async chain for async waterfall
const fsCallback = next => {
  //readfile api takes the file url and return a buffered data chunk in a callbacck function
  fs.readFile(process.argv[2], (err, data) => {
    //calling the callback function on the async chain with result from the read file
    next(null, data.toString("utf-8"));
  });
};

//the callback that will  be used for async calling
//url - url passed to call the http server
//next - this will be a callback provided by async library so that we can call next function in async chain
const httpCallback = (url, next) => {
  //Get method makes an http get request to the given url
  http.get(url, res => {
    let httpResult = "";
    res.on("data", chunk => {
      //concatenating the http response
      httpResult += chunk.toString();
    });
    //setting up clean up listeners for each event   (end -on the http response stream end, err - on http response stream error)
    res
      .on("end", () => {
        //invoke the next callback on the async chain with the result passed to it
        next(null, httpResult);
      })
      .on("err", err => {
        //invokes the main callback with error object directly
        next(err);
      });
  });
};
/*
More often than not you will need to do multiple asynchronous calls one
  after the other with each call dependent on the result of previous
  asynchronous call. We can do this with the help of async.waterfall.
  
  This takes an array of callback to be executed in a waterfall manner
*/
async.waterfall([fsCallback, httpCallback], (err, result) => {
  console.log(result);
});
