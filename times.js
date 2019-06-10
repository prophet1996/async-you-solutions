const http = require("http"); //Package used to make http request
const async = require("async"); //Package used for async operation handling

//the callback that will  be used for async calling
//url - url passed to call the http server
//next - this will be a callback provided by async library so that we can call next function in async chain
const postCallback = (id, next) => {
  //Post data to be sent over http
  const postData = JSON.stringify({ user_id: id + 1 });
  //Configuration options for http object
  const options = {
    method: "POST",
    hostname: process.argv[2],
    port: process.argv[3],
    path: "/users/create",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  const req = http.request(options, res => {});
  // Write data to request body
  req.write(postData);
  //must end the req
  req.end();
  //call the next callaback in chain
  next(null);
};
//http callback

const httpCallback = next => {
  const url = `http://${process.argv[2]}:${process.argv[3]}`;

  http.get(url, res => {
    //Get method makes an http get request to the given url

    let httpResult = "";
    // on method sets up a 'data' event listner on the http response (as the response comes in chunks)

    res.on("data", chunk => {
      //concatenating the http response
      httpResult += chunk.toString();
    });
    //setting up clean up listeners for each event   (end -on the http response stream end, err - on http response stream error)
    res
      .on("end", () => {
        //this gets returned as {get:".....whatever the http result is .."}
        next(null, httpResult);
      })
      .on("err", err => {
        //invokes the main callback with error object directly
        next(err);
      });
  });
};
//using async.time method that calls an async function n number of times and accumulates the result in the main callback
async.series(
  {
    post: next => {
      async.times(5, postCallback, (err, result) => {
        next(err, result);
      });
    },
    get: next => httpCallback(next)
  },
  (err, result) => {
    //we only need the get request result
    console.log(result.get);
  }
);

/*
final result  is something like this
   {get:"{\"users\":[{\"user_id\":1},{\"user_id\":2},{\"user_id\":3},{\"user_id\":4},{\"user_id\":5}]}"}
*/
