# 🏗 Multi-Sig Wallet

🚀 Built with [Scaffold-Eth](https://github.com/scaffold-eth/scaffold-eth)

✨ Demo deployed on : [multisig-seashore.surge.sh](https://multisig-seashore.surge.sh/)

Create multiple multisignature wallets and see their details as well as propose, execute, and sign transactions - all in just a few clicks.

<img width="1131" alt="image" src="https://user-images.githubusercontent.com/12888080/159298438-ade3d676-5275-4c6e-978b-9421bcb5f746.png">
<img width="575" alt="image" src="https://user-images.githubusercontent.com/12888080/159298592-3fbfd03e-c319-41ce-8008-153d1cfd2a1d.png">
<img width="1123" alt="image" src="https://user-images.githubusercontent.com/12888080/159298776-dd498375-4554-444a-adb5-9272f7dcaec0.png">

# 🏄‍♂️ Getting Started Locally

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🪄 metamulti-sig:

```bash
git clone https://github.com/elducati/metamulti-sig.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd metamulti-sig
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd metamulti-sig
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd metamulti-sig
yarn deploy
```

> in a fourth terminal window, 🗄 start your backend:

```bash
cd metamulti-sig
yarn backend
```

📱 Open http://localhost:3000 to see the app

---

### 🚢 Ship it 🚁

📡 Edit the `defaultNetwork` to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/) in `packages/hardhat/hardhat.config.js`

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

⛽️ You will need to send ETH to your **deployer address** with your wallet.


 >  🚀 Run `yarn deploy --network default-network` to deploy your smart contract to a public network (selected in hardhat.config.js)

 📦  Run `yarn build` to package up your frontend.
 
💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

>  😬 Windows users beware!  You may have to change the surge code in `packages/react-app/package.json` to just `"surge": "surge ./build",`

⚙ If you get a permissions error `yarn surge` again until you get a unique URL, or customize it in the command line.

🚔 Traffic to your url might break the [Infura](https://infura.io/) rate limit, edit your key: `constants.js` in `packages/ract-app/src`.

---

# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 💌 P.S.
Credit to https://github.com/stevenpslade/maas

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!
