const http = require("http"); //Package used to make http request
const async = require("async"); //Package used for async operation handling

//the callback that will  be used for async calling
//url - url passed to call the http server
//next - this will be a callback provided by async library so that we can call next function in async chain
const httpCallback = (url, next) => {
  //Get method makes an http get request to the given url
  http.get(url, res => {
    let httpResult = "";
    // on method sets up a 'data' event listner on the http response (as the response comes in chunks)
    res.on("data", chunk => {
      //concatenating the http response
      httpResult += chunk.toString();
    });
    //setting up clean up listeners for each event   (end -on the http response stream end, err - on http response stream error)
    res
      .on("end", () => {
        //invoke the next callback on the async chain
        next(null, httpResult);
      })
      .on("err", err => {
        //invokes the main callback with error object directly
        next(err);
      });
  });
};

//async.series sequentially  executes each callback and pass on the result to the main callback
async.series(
  {
    requestOne: next => httpCallback(process.argv[2], next),
    requestTwo: next => httpCallback(process.argv[3], next)
  },
  (err, result) => {
    console.log(result);
  }
);

/*
The main difference between the waterfall and series functions is that the
  result from a task function in async.series won't be passed along to the
  next function once it completes. series will collect all results as an
  array and pass it to the optional callback that runs once all of the task
  functions have completed.

For eg:-
 "{"                               
   "  requestOne: 'one is smaller than 2'",
   "  requestTwo: 'two greater than one'" ,
   "}"
*/
