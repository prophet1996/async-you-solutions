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
//using async.map we map the async callback function to each argument passed to the
//async callback function. Map differs from each in that it send the result in an
// array to the main callback
async.map([process.argv[2], process.argv[3]], httpCallback, (err, result) => {
  console.log(result);
});
