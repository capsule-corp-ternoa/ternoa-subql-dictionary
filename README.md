# 🚚 Ternoa Dictionary

Ternoa Dictionary records all the native substrate on-chain data of the Ternoa blockchain: blocks, extrinsics, and events. It is a glossary of data that pre-indexes chain events, drastically improving the overall indexing performance.

Don't forget to have fun with it, Cheers 🍻

> ⚠️ DISCLAIMER
>
> Some blocks containing technicalCommittee.close extrinsic are corupted on Mainnet. There is an outsync from the proposalWeightBound parameter type.
> Please make sure to skip them when syncing the Dictionary.
>
> The corrupted block list for MAINNET:
>
> - 2,411,217
> - 2,411,393
> - 2,412,944
> - 2,423,798
> - 2,425,504
> - 2,768,585

**Table of Contents:**

- [Introduction](#introduction)
  - [Dictionary](#dictionary)
  - [Error Reporting](#error-reporting)
- [Installation](#installation)
- [Using the Dictionary](#using-the-dictionary)
  - [Examples](#examples)
- [Using Dictionary as an Explorer](#using-dictionary-as-an-explorer)

## Introduction

**Ternoa is a Decentralised, Open source, NFT-centric Layer 1 blockchain that is multi-chain by design and aims to provide a technical stack to build scalable and secure NFTs with native support for advanced features.**

#### For Builders By Builders

NFTs native to our chain can be minted using High-level programming languages and doesn't require smart contract functionality.

#### Native support for Advanced Features

With native support for Secret NFTs, Delegating and Lending, Transaction Batching and much more, you might want to give it a try.

### Dictionary

The Dictionary acts as the middleman between the Blockchain and the Indexer. This allows the Indexer to query a block’s metadata from the dictionary, allowing one to query blocks for specific events and only return the required blocks. For example: If one wants to fetch NFT creation events only, the Indexer will ask the dictionary for the corresponding blocks, returning only the blocks where NFT creation took place (for example: 5, 9, 32, etc.) instead of all of the blocks (lets say 1 - 100).

### Error Reporting

If you encounter any errors along the way, technical or otherwise. Let us know and we'll deal with it swiftly.
It'll help us further improve the overall experience for our users.

- Open a discussion of type `General` in the [discussions section](https://github.com/capsule-corp-ternoa/ternoa-subql-dictionary/discussions) if you encounter any unexpected behaviour.
- Open a Bug report using the [bug template](https://github.com/capsule-corp-ternoa/ternoa-subql-dictionary/issues/new) if the bug persists.
- If you can, suggest a fix in a pull request to resolve that issue.

Make sure to document the error properly, keeping in mind that the better you describe it, the easier it is to deal with.

## Installation

### 1. Clone the Repository

Clone this repository by running this command:

```bash
git clone https://github.com/capsule-corp-ternoa/ternoa-subql-dictionary
```

### 2. Change Directory

Change the Directory for desired results:

```bash
cd ternoa-subql-dictionary
```

### 3. Select Network Environment

Move to the appropriate branch depending on the targeted network environment:

- `v43/mainnet` for Mainnet
- `v43/alphanet` for Alphanet

For example:

```bash
git checkout v40/testnet
# The indexer and dictionary should be on same version.
```

### 4. Install Dependencies

Install the required dependencies for the project using:

```bash
yarn install
```

### 5. Generate GraphQL Types

Generate types from your GraphQL schema and Operations:

```bash
yarn codegen
```

#### 6. Build your implementation

Create an Executable version of your project:

```bash
yarn build
```

#### 7. Docker pull

Pull the latest versions of the Docker image using:

```bash
docker-compose pull
```

#### 8. Run

Run your compiled app with Docker using:

```bash
docker-compose up
```

**Wait a couple of seconds for the indexing to start, after that you can access the Blockchain data in your [local](http://localhost:3000/) GraphQL playground**

## Using the Dictionary

You can significantly improve the indexation performance by using a dictionary endpoint instead of targeting the blockchain directly to gather data.

Just make sure to select the correct endpoints for the desired networks:

As you can see that the endpoints for Networks are structured as `wss://xxxxxxxx.ternoa.com` and `https://dictionary-xxxxxxxx.ternoa.com` which is replaced by the `Network designation`.

Supported dictionary environment networks are Mainnet and Alphanet.

### Examples

For use on `Mainnet`:

```yaml
 genesisHash: '0x6859c81ca95ef624c9dfe4dc6e3381c33e5d6509e35e147092bfbc780f777c4e'
 endpoint: 'wss://mainnet.ternoa.network'
```

For use on `Alphanet`:

```yaml
 genesisHash: '0x18bcdb75a0bba577b084878db2dc2546eb21504eaad4b564bb7d47f9d02b6ace'
 endpoint: 'wss://alphanet.ternoa.com'
```

## Using Dictionary as an Explorer

Ternoa Explorer is an example of a project relying on Ternoa Dictionary. It enables you to visualize the on-chain activity, explore public addresses and their transaction histories, gather information about individual blocks and much more.