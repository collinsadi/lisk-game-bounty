// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MemoryGameRewardsModule = buildModule("MemoryGameRewardsModule", (m) => {
  const MemoryGameRewards = m.contract("MemoryGameRewards");

  return { MemoryGameRewards };
});

export default MemoryGameRewardsModule;
