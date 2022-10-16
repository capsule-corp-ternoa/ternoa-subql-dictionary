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


## Using the Dictionary

You can significantly improve the indexation performance by using a dictionary endpoint instead of targeting the blockchain directly to gather data.

Just make sure to select the correct endpoints for the desired networks :

As you can see that the endpoints for Networks are structured as `Wss://xxxxxxxx.ternoa.com` and `https://dictionary-xxxxxxxx.ternoa.com` which is replaced by the `Network designation`.

The most famous network designations being `Mainnet`, `Alphanet`, `Chaosnet`, `Testnet` and various sub versions of the existing networks.

#### Examples -

For use on the `Testnet` :
```
  genesisHash: '0xd9adfc7ea82be63ba28088d62b96e9270ad2af25c962afc393361909670835b2' 
  endpoint: 'wss://testnet.ternoa.com'
  dictionary: 'https://dictionary-testnet.ternoa.dev/'
  chaintypes:
    file: ./types.json
```

For use on the `Mainnet` :
```
  genesisHash: '0xd44bcfb0e98da45ace37e4df8469e5dbba8c4fc5449acda24c50cea6f5f2ca99'
  endpoint: 'wss://mainnet.ternoa.com'
  dictionary: 'https://dictionary-mainnet.ternoa.dev/'
  chaintypes:
    file: ./types.json
```

The same goes for the `Chaos` network or its feature staging area `Staging.Chaos` 

The network endpoints for the sub nets stay the same whereas the dictionary endpoint varies slightly like `Staging.Chaos` or `Dev.Chaos`, only requiring the specific versions of a network. 

For example, the Dictionary endpoint for `Staging.Chaos` being `https://dictionary-staging.ternoa.dev/` and `https://dictionary-dev.ternoa.dev/` for `Dev.Chaos`.
    
**Learn more about the different network versions over at `Ternoa-Fundamentals/Networks`**

## Using Dictionary as an Explorer


As the Dictionary records all generic data (be it Intrinsic or Extrinsic), It can be later used to visualize and relay On-Chain information as a Block explorer like [etherscan](https://etherscan.io/) for the ethereum blockchain.


You can use Ternoa's " [Explorer](https://explorer.ternoa.com/) " as a Blockchain Search Engine, which enables you to visualize the On-Chain activity, explore public addresses and their Transaction history, gather information about individual blocks and much more.