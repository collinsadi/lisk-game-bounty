import "@rainbow-me/rainbowkit/styles.css";
import GameBoard from "./components/GameBoard";
import { useAccount } from "wagmi";
import { ConnectBtn } from "./components/ConnectBtn";
import { WalletButton } from '@rainbow-me/rainbowkit';
function App() {
  const account = useAccount();
  return (
    <>
      {account.isConnected ? (
        <GameBoard />
      ) : (
        <div className="flex flex-col fixed top-0 left-0 h-full w-full items-center justify-center">
          {/* <ConnectBtn /> */}

          <WalletButton  wallet="metamask" />

          <p className="mt-5 text-white">Play and Earn LSK tokens</p>
        </div>
      )}
    </>
  );
}

export default App;
