import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

const WalletNFTSalePage = () => {
  const { publicKey, signTransaction } = useWallet();
  const [nftAddress, setNftAddress] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] || null);
    }
  };

  const handleSellNFTAndSendEmail = async () => {
    if (!publicKey || !signTransaction) {
      setStatus('Please connect your wallet first.');
      return;
    }

    if (!email || !file) {
      setStatus('Please provide both email and PDF file.');
      return;
    }

    try {
      setStatus('Initiating sale and sending email...');

      // Sell NFT logic (same as before)
      const connection = new Connection('https://api.devnet.solana.com');
      const receiverAddress = new PublicKey('11111111111111111111111111111111');
      const nftTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(nftAddress),
        publicKey
      );
      const transferInstruction = createTransferInstruction(
        nftTokenAccount,
        await getAssociatedTokenAddress(new PublicKey(nftAddress), receiverAddress),
        publicKey,
        1,
        [],
        TOKEN_PROGRAM_ID
      );
      const transaction = new Transaction().add(transferInstruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());

      // Send email with PDF
      const formData = new FormData();
      formData.append('email', email);
      formData.append('file', file);

      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      });

      if (emailResponse.ok) {
        setStatus(`NFT sold successfully! Transaction ID: ${txid}. Email sent with PDF.`);
      } else {
        setStatus(`NFT sold, but there was an error sending the email. Transaction ID: ${txid}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 text-white font-monument-sans flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Sell Your NFT for 1 Cent</h1>
      <WalletMultiButton className="mb-4" />
      {publicKey && (
        <>
          <input
            type="text"
            placeholder="Enter NFT Address"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded bg-purple-800 text-white mb-4"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded bg-purple-800 text-white mb-4"
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full max-w-md mb-4"
          />
          <button
            onClick={handleSellNFTAndSendEmail}
            className="bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-purple-100 transition-colors"
          >
            Sell NFT and Send PDF
          </button>
        </>
      )}
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
};

export default WalletNFTSalePage;