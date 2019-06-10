const http = require("http"); //Package used to make http request
const async = require("async"); //Package used for async operation handling

//the callback that will  be used for async calling
//url - url passed to call the http server
const httpCallback = (url, next, result) => {
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

        results.push(httpResult);
        next(null, results);
      })
      .on("err", err => {
        //invokes the main callback with error object directly
        next(err);
      });
  });
};
//using async.until we run a function until a test function passes based on the result
const results = [];
async.whilst(
  function test() {
    return results.indexOf("meerkat") === -1;
  },
  function iter(next) {
    httpCallback(process.argv[2], next, results);
  },

  function done(err) {
    // all pages have been fetched
    console.log(results.length);
  }
);
