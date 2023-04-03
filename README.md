# webapp

# Assignment 7

```Name: Kush Salaskar, NUID - 001091785```

# Steps to setup the app locally

1. Clone the Organization Repo using ```git clone``` command followed by the SSH link
   using the terminal

    Example: ```git@github.com:SPRING2023-CSYE6225/webapp.git```

2. In the terminal run the ```npm i``` command
3. After all the dependencies are installed, Use ```npm start``` in production
4. Use postman to check the API endpoints
5. The index.js file is the entry file of the application

# Steps to test the app locally

1. Run ```npm i``` to install all dependencies
2. In terminal use the ```npm test``` command to run tests using Jest
3. All test files are kept in the test folder 

# Steps for running continuous integration 

1. The CI script can be found in the file ```.github/workflows/ci.yml``` 
2. A workflow will be triggered if the code is pushed to a forked remote branch. Check the running workflow using the ```Actions``` tab
3. A pull request to the Upstream branch will start a workflow

# Added Packer build

1. You can create an AMI manually using the ```packer build``` command.
