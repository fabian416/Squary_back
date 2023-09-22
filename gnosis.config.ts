import { ethers } from 'ethers';
import { EthersAdapter } from '@safe-global/protocol-kit';

// Conexión al proveedor
const RPC_URL = 'https://eth-goerli.public.blastapi.io';
export const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Función para obtener el adaptador Ethers para un usuario específico
export function getEthersAdapter(userPrivateKey: string) {
    const signer = new ethers.Wallet(userPrivateKey, provider);
    return new EthersAdapter({
        ethers,
        signerOrProvider: signer
    });
}
