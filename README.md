# Node.js AWS Lambda project template

Just clone it locally, execute `npm install` in the root folder, and do the following:

### .env

Create a file named ".env" (it's literally just ".env", it's not "something.env") in the root folder. Add this:

    MONGODB_ATLAS_CLUSTER_URI=mongodb://user:password@yourservers
    
Use whatever connection string you want for your mongo cluster. This file is used to load any local environment variables.
**This file should not go into source control.**

### environment.{stage}.yml

Create a file named "environment.dev.yml" (here the stage is "dev") in the root folder. Add this:

    MONGODB_ATLAS_CLUSTER_URI: mongodb://user:password@yourservers
    
>*Do notice this uses a ":" instead of "=" like the ".env" file.*

Replace the connection string with the one that should be used in the **dev** AWS environment.
You need to also create a file named "environment.prod.yml", and insert the **prod** connection strings for your mongo cluster.
**These files should not go into source control.**

### package.json

You may change the "name" property if you want.

### serverless.yml

This file is used when deploying to AWS Lambda, this is not used locally when debugging with **nodemon**.

You may change these properties:

- service
- provider -> region

Each property under the *functions* property represents one lambda function. It's possible to have many endpoints sharing the same function, however you may want to create one function per endpoint, like:

    functions:
      getProducts:
        handler: lambda.httpHandler
        events:
          - http:
              path: api/products
              method: get
      getProductsById:
        handler: lambda.httpHandler
        events:
          - http:
              path: api/products/{id}
              method: get
      createProduct:
        handler: lambda.httpHandler
        events:
          - http:
              path: api/products
              method: post
              
You could also group all endpoints for a single controller/route (e.g products) into one single function, if that makes sense:

    functions:
      products:
        handler: lambda.httpHandler
        events:
          - http:
              path: api/products
              method: get
          - http:
              path: api/products/{id}
              method: get
          - http:
              path: api/products
              method: post

Functions can be triggered by many event types, such as : Http, S3, SQS, SNS, DynamoDb, etc. To see all available event triggers, refer to [the serverless.yml docs](https://serverless.com/framework/docs/providers/aws/events/).

All functions need a handler. A handler is just a method in **lambda.js** file that will receive two parameters: event and context. The event is an object that will have a different structure based on the event type. For instance, an http event will have the request data, like headers, body, url path, the http verb used. The handler method in **lambda.js** file is responsible for inspecting the event, extracting the relevant data, and call the relevant method based on it.

This template project already comes with an `httpHandler` method defined in **lambda.js** file, which simply uses the [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) module to do that hard word, like inspecting the event object, creating a **request object that an express server can understand**. In a more technical way, it acts as a proxy to forward http requests to the express server configured in **app.js**. The express server will call the appropriate route from **routes.js** file, which will delegate to the correct controller method.

The existing demo functions are configured in **serverless.yml** to use this `httpHandler` method.

Tips:
- By definition, all functions represent one specific logic. For instance, it's usually not a good idea to have the same function handling multiple methods with completely different logic/purpose (e.g a create product method and a query all products method).
- A function could have multiple triggers (e.g http, sns, S3), as soon as all of them lead to the same logical code.
- The idea of having separate functions, is that you'll be able to manage it independently in AWS console. You'd be able to see how much each function costs, and it's easier to figure what function costs too much, and try to understand why (and potentially fix it).
- We don't really need express to handle http calls, nor *aws-serverless-express* module. The reason we use express is to make easier testing/debugging our code locally. Then since we are already using express, why not use *aws-serverless-express* to automatically delegate http calls from lambda? ;)

To see the full "serverless.yml" reference, [see here](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/).

However, if you use other triggers, you'll need to properly configure **lambda.js** file to handle those calls (see next section).

### lambda.js

This file is not used when you run the project in your local environment. This file is just used when executing in AWS Lambda. Recall in **serverless.yml** file we have functions with this: `handler: lambda.httpHandler`. This means it'll use a "httpHandler" delegate inside "lambda.js" file. See:

    module.exports.httpHandler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
    
You could have `handler: lambda.something` and a code like `module.exports.something = (event, context) => { ... }`. You can have as many as handlers as you want. For instance, if you have a function that is triggerd by http and sns, you'd need to handle the sns call somehow inside `lambda.js`, like this:

    modules.exports.snsHandler = (event, context) => { productService.create(event.Records[0]) }
    
Each type of event will have a different data structure. The handler code should somehow figure how to extract the relevant data from the `event` object, and call the appropriate code. When it comes to an http event, this is done by the **aws-serverless-express** module, by calling its `proxy()` method, as soon as the function is configured to use the `httpHandler` from **lambda.js**.

## Testing
You can run it locally by executing `npm run dev`. This will actually execute the script configured in "package.json", which uses nodemon to run **app.local.js**. This file is not executed in AWS Lambda.

The **app.local.js** file will load the local environment variables from the **.env** file, and listen to a port (default is 3000).

If you want to attach the debugger in VS Code, open `File > Preferences > Settings`. In the search bar, write "node debug". This should find a *Node Debug* extension. There will be an item `Debug > Node: Auto Attach` with a dropdown. Select the "on" option from the dropdown.

After that, you can attach by choosing the process whose file is **app.local.js**.
