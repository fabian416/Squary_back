"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEthersAdapter = exports.provider = void 0;
const ethers_1 = require("ethers");
const protocol_kit_1 = require("@safe-global/protocol-kit");
// Conexión al proveedor
const RPC_URL = 'https://eth-goerli.public.blastapi.io';
exports.provider = new ethers_1.ethers.providers.JsonRpcProvider(RPC_URL);
// Función para obtener el adaptador Ethers para un usuario específico
function getEthersAdapter(userPrivateKey) {
    const signer = new ethers_1.ethers.Wallet(userPrivateKey, exports.provider);
    return new protocol_kit_1.EthersAdapter({
        ethers: ethers_1.ethers,
        signerOrProvider: signer
    });
}
exports.getEthersAdapter = getEthersAdapter;
