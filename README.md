# 🤔 Introduction

The Dictionary provides a glossary of data that pre indexes On-Chain events, drastically improving the overall Indexing performance. Sometimes by a factor of 10, which is quite significant.

The Dictionary acts as the middleman between the Blockchain and the Indexer. This allows the Indexer to query a block's metadata from the dictionary, allowing one to query blocks for specific events and only return the required blocks.

For example : If one wants to fetch NFT creation events only, the Indexer will ask the dictionary for the corresponding blocks, returning only the blocks where NFT creation took place (5, 9, 32, etc.) instead of all blocks (1 - 100).

## Installation 

#### 1. Clone the Repository

Clone this repository by running this script :

```
git clone https://github.com/capsule-corp-ternoa/ternoa-subql-dictionary
```

#### 2. Change Directory

Change the Directory for the desired results : 
```
cd ternoa-subql-dictionary
```

#### 3. Select Testnet version

Select the appropriate testnet version which corresponds to the Indexer version you are using to ensure compatibility :

```
git checkout v40/testnet
# The indexer and dictionary should be on same version.
```

#### 4. Install Dependencies

Install the required dependencies for the project using :

```
yarn install
```
#### 5. Generate Code from GraphQL

Generate code from your GraphQL schema and Operations :

```
yarn codegen
```

#### 6. Build your Implementation

Create an Executable version of your project :
    
```
yarn build
```

#### 7. Docker pull

Pull the latest versions of the Docker image using :

```
docker-compose pull
```

#### 8. Run 

Run your compiled app with Docker using :

```
docker-compose up
```

**Wait a couple of seconds for the indexing to start, after that you can access the Blockchain data in your [local](http://localhost:3000/) GraphQL playground**

## Using Dictionary as an Explorer


The Dictionary records all generic data (intrinsic or extrinsic) which can later be used to relay On-Chain information in an appropriate manner for an [explorer](https://etherscan.io/). 

Explore Ternoa's explorer [Ternoa Scan](https://explorer.ternoa.com/) here

## SubQuery - Project

**SubQuery allows developers to extract, transform and query blockchain data in real time using GraphQL.**

What SubQuery Dictionary does is provide a glossary of data that pre indexes On-Chain events thereby significantly improving the Indexing performance of the project.

It scans the network for all events (intrinsic or extrinsic) block by block and document the results.

If you want to create your SubQuery Dictionary to speed up indexing of your own Substrate chain, fork [this](https://github.com/subquery/subql-dictionary) project.

#### Getting Started


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