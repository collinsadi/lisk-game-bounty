// import aurelia from "/assets/images/aurelia.svg";
// import angular from "/assets/images/angular.svg";
// import ember from "/assets/images/ember.svg";
// import vue from "/assets/images/vue.svg";
// import backbone from "/assets/images/backbone.svg";
// import react from "/assets/images/react.svg";

import arbitrum from "/assets/images/l2/arbitrum.svg";
import base from "/assets/images/l2/base.svg";
import lisk from "/assets/images/l2/lisk.svg";
import optimism from "/assets/images/l2/optimism.svg";
import starknet from "/assets/images/l2/starknet.svg";
import zksync from "/assets/images/l2/zksync.svg";

const cards = [
  { id: 1, name: "arbitrum", image: arbitrum },
  { id: 2, name: "arbitrum", image: arbitrum },
  { id: 3, name: "base", image: base },
  { id: 4, name: "base", image: base },
  { id: 5, name: "lisk", image: lisk },
  { id: 6, name: "lisk", image: lisk },
  { id: 7, name: "optimism", image: optimism },
  { id: 8, name: "optimism", image: optimism },
  { id: 9, name: "starknet", image: starknet },
  { id: 10, name: "starknet", image: starknet },
  { id: 11, name: "zksync", image: zksync },
  { id: 12, name: "zksync", image: zksync },
];

export const cardsData = cards.map((card) => ({
  ...card,
  order: Math.floor(Math.random() * 12),
  isFlipped: false,
}));
