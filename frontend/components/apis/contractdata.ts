import swapLab from "../../../backend/deployments/alfajores/SwapLab.json";
import testToken from "../../../backend/deployments/alfajores/TestToken.json";
import member from "../../../backend/deployments/alfajores/Membership.json";

export default function getContractData() {
  return {
    swapAbi: swapLab.abi,
    swapLabAddr: swapLab.address,
    testTokenAbi: testToken.abi,
    testAddr: testToken.address,
    memberAbi: member.abi,
    memberAddr: member.address
  }
}