import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RedCandleTokenModule = buildModule("TokenModule", (m) => {
  const token = m.contract("RedCandleToken");

  return {
    token,
  };
});

export default RedCandleTokenModule;
