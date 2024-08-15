import dynamic from 'next/dynamic';

const WalletNFTSalePage = dynamic(
  () => import('../components/WalletConnection'),
  { ssr: false }
);

export default function SellNFTPage() {
  return <WalletNFTSalePage />;
}