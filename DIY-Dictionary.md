

## DIY Dictionary

### Starter Project


SubQuery Dictionary provides a glossary of data that pre indexes On-Chain events thereby significantly improving the Indexing performance of the project.

It scans the network for all events (intrinsic or extrinsic) block by block and document the results.

If you want to create your Dictionary to speed up the indexing of your own Substrate chain, fork [this](https://github.com/subquery/subql-dictionary) project.


### Getting Started


##### 1. Install Dependencies 

Install all the required dependencies by running this script :

```
yarn
```

##### 2. Generate Types

Code generation is handled using the following script :

```
yarn codegen
```

##### 3. Build the Implementation

Use this script to build an executable implementation of the Dictionary :
```
yarn build
```

##### 4. Run it locally

Run your Implementation locally using Docker :

```
yarn start:docker
```