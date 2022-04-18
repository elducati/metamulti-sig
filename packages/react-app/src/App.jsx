import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { MailOutlined } from "@ant-design/icons";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, List, Tabs, Menu, Input, Divider } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useBalance, useEventListener } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, Balance, AddressInput, EtherInput } from "./components";
import { Transactor } from "./helpers";
import { parseEther, formatEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph, CreateTransaction, Owners } from "./views";
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)
*/
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
const { TabPane } = Tabs;

const DEBUG = true

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/" // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
//const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://localhost:8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);



function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); //1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); //1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  const contractName = "YourContract";

  

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...")

  // just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if (DEBUG) console.log("📝 readContracts", readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if (DEBUG) console.log("🔐 writeContracts", writeContracts)


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);
  // 📟 Listen for broadcast events
  const ownerEvents = useEventListener(readContracts, contractName, "Owner", localProvider, 1);
  const signaturesRequired = useContractReader(readContracts, contractName, "signaturesRequired");
  const poolServerUrl = "http://localhost:3000/";

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname)
  }, [window.location.pathname]);



  const [toAddress, setToAddress] = useState()
  const [value, setValue] = useState()
  const [hash, setHash] = useState()
  // = useContractReader(readContracts, "YourContract", "getHash",[nonce, toAddress, value])

  const nonce = useContractReader(readContracts, "YourContract", "nonce")

  console.log("hash", hash)

  const [signature, setSignature] = useState()


  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <BrowserRouter>

        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link onClick={() => { setRoute("/") }} to="/">YourContract</Link>
          </Menu.Item>
          <Menu.Item key="/owners">
            <Link onClick={() => { setRoute("/owners") }} to="/owners">Owners</Link>
          </Menu.Item>
          <Menu.Item key="/create">
            <Link onClick={() => { setRoute("/create") }} to="/create">Create</Link>
          </Menu.Item>
          <Menu.Item key="/debug">
            <Link onClick={() => { setRoute("/debug") }} to="/debug">debug</Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">

            <div style={{ width: 400, margin: "auto", marginTop: 32 }}>

              <Address
                value={readContracts ? readContracts.YourContract.address : ""}
                ensProvider={mainnetProvider}
                blockExplorer={blockExplorer}
                fontSize={28}
              />

              <Balance
                address={readContracts ? readContracts.YourContract.address : ""}
                provider={localProvider}
                dollarMultiplier={price}
              />

              <div style={{ marginTop: 32, padding: 10 }}>

                <div style={{ marginBottom: 16 }}>
                  nonce: #{nonce ? nonce.toNumber() : ""}
                </div>

                <AddressInput
                  autoFocus
                  ensProvider={mainnetProvider}
                  placeholder="to address"
                  value={toAddress}
                  onChange={setToAddress}
                />
              </div>
              <div style={{ padding: 10 }}>
                <EtherInput
                  price={price}
                  value={value}
                  onChange={(v) => {
                    setValue(parseEther("" + parseFloat(v).toFixed(12)))
                  }}
                />
              </div>

              <Button onClick={async () => {
                console.log("nonce, toAddress, value", nonce, toAddress, value)

                let newHash = await readContracts.YourContract.getHash(nonce, toAddress, value)
                console.log("newHash--->", newHash)

                if (newHash) {
                  setHash(newHash)
                } else {
                  console.log("Either the address wasn't recovered right or signer is not the owner...")
                }
              }}>

                HASH
              </Button>

              <Divider />

              <div style={{ marginTop: 32 }}>
                <div style={{ marginTop: 32 }}>
                  hash: <Input
                    value={hash}
                  />
                </div>
              </div>


              <Button style={{ marginTop: 16 }} onClick={async () => {
                console.log("nonce, toAddress, value, hash:", nonce, toAddress, value, hash)

                let newSignature = await userProvider.send("personal_sign", [hash, address]);
                console.log("newSignature", newSignature)

                let recover = await readContracts.YourContract.recover(hash, newSignature)
                console.log("recover--->", recover)

                let owner = await readContracts.YourContract.owner()
                console.log("owner--->", owner)

                if (recover == address && owner == recover) {
                  console.log("correctly recovered, saving...")
                  setSignature(newSignature)
                } else {
                  console.log("Either the address wasn't recovered right or signer is not the owner...")
                }
              }}>

                SIGN
              </Button>

              <Divider />

              <div style={{ marginTop: 32 }}>
                <div style={{ marginTop: 32 }}>
                  signature: <Input
                    value={signature}
                    onChange={(e) => { setSignature(e.target.value) }}
                  />
                </div>
              </div>


              <Button style={{ marginTop: 16 }} onClick={async () => {
                let recover = await readContracts.YourContract.recover(hash, signature)
                console.log("recover--->", recover)

                let owner = await readContracts.YourContract.owner()
                console.log("owner--->", owner)

                if (owner == recover) {
                  console.log("correctly recovered, sending...")

                  tx(writeContracts.YourContract.metaSendValue(toAddress, value, signature))
                } else {
                  console.log("Either the address wasn't recovered right or signer is not the owner...")
                }
              }}>

                SEND
              </Button>


            </div>



          </Route>
          <Route path="/owners">
            <Owners
              contractName={contractName}
              ownerEvents={ownerEvents}
              signaturesRequired={signaturesRequired}
              address={address}
              nonce={nonce}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              readContracts={readContracts}
              writeContracts={writeContracts}
              blockExplorer={blockExplorer}
            />
          </Route>
          <Route path="/create">
            <CreateTransaction
              poolServerUrl={poolServerUrl}
              contractName={contractName}
              address={address}
              setRoute={setRoute}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              readContracts={readContracts}
              writeContracts={writeContracts}

            />
          </Route>
          <Route path="/debug">
            <Contract
              name="YourContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </BrowserRouter>


      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {

              /*  if the local provider has a signer, let's show the faucet:  */
              localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf("localhost") >= 0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>

    </div>
  );
}


/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default App;