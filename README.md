# Rate-limiter

This rate limiter will identify the client by it's IP address whatever it's behind a proxy or not.

For testing purpose you could send your preferred identification (name , ID...) in the request headers by passing the value to the "me" prop of the request headers.

e.g
request.headers.me = "Jhon Doe";
