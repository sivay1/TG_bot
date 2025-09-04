import dotenv from "dotenv";
dotenv.config();
import { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";



const connection = new Connection(process.env.RPC_URL || clusterApiUrl("mainnet"), "confirmed");




const wallet2 = new PublicKey("D5jx4wmxuPz18hqmgpCMLGVq3uSksCafCp5xjVe1nw8p");

async function main() {
  try{
    const balance = await connection.getBalance(wallet2);  
    let finalBalance = balance / LAMPORTS_PER_SOL
    const returnBalance = parseFloat(finalBalance.toFixed(2));
    //console.log("SOL balance: ", parseFloat(finalBalance.toFixed(2)));
    const usdcPrice = await fetchSolanaPrice();
    console.log(usdcPrice);
    const finalUsdcPrice = finalBalance * usdcPrice;
    const returnUsdc = parseFloat(finalUsdcPrice.toFixed(2));
    //console.log("In USDC: ", parseFloat(finalUsdcPrice.toFixed(2)));
    //console.log(returnBalance , returnUsdc);
    return {returnBalance , returnUsdc, wallet2};
    }catch(err){
        console.log("error",err.message);
    }
};
export async function fetchSolanaPrice() {
  
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'solana',
          vs_currencies: 'usd'
        },
        timeout: 5000 // 5 second timeout
      }
    );
    
    return response.data.solana.usd;
  } catch (error) {
    console.warn('Error...', error instanceof Error ? error.message : error);

  }
  
}
//main().then(console.log).catch(console.error);

export default main;