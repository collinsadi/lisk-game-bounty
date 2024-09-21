import { WalletButton } from "@rainbow-me/rainbowkit";
export const ConnectBtn = () => {
  return (
    <WalletButton.Custom wallet="metamask">
      {({ ready, connect }) => {
        return (
          <button type="button" disabled={!ready} onClick={connect}>
            Connect Rainbow
          </button>
        );
      }}
    </WalletButton.Custom>
  );
};
