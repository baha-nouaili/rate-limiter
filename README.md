# Rate-limiter

This rate limiter will identify the client by it's IP (since the application is deployed then the IP address will be a private IP address (load balancer or reverse proxy) where the server is hosted).

For testing purpose you could send your preferred identification (name , ID...) in the request headers by passing the value to the "me" prop of the request headers.

e.g
request.headers.me = "Jhon Doe";
