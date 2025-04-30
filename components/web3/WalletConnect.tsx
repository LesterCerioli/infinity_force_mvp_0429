import Button from '@/components/button';
import { EventCategory, EventName } from '@/constants/event';
import { downloadClickAtom } from '@/store/web3/state';
import React, { useState } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import { useConnect } from 'wagmi';
import { WalletType } from './WalletPopover';
import { EmailAuthForm } from '../auth/EmailAuthForm';
ReactGA.event({ category: EventCategory.Global, action: EventName.ToInvitation });

type WalletConnectProps = {
  setWalletType?: (type: WalletType) => void;
};
type AuthMode = 'wallet' | 'email';


function WalletConnect({ setWalletType }: WalletConnectProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('wallet');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { connect, connectors } = useConnect({
    onSuccess: () => {
      ReactGA.event({ category: EventCategory.Global, action: EventName.ConnectResult, label: 'success' });
    },
    onError: (error, { connector }) => {
      ReactGA.event({ category: EventCategory.Global, action: EventName.ConnectResult, label: 'failed' });
      if (error.name === 'ConnectorNotFoundError' && connector.name === 'MetaMask') {
        window.open('https://metamask.io');
        return;
      }
    },
  });
  const [downloadClick, setDownloadClick] = useRecoilState(downloadClickAtom);

  /**
   * connectWallet
   * @param connector
   */
  const connectWallet = (connector: any | undefined) => {
    connector && connect({ connector });
  };

  const onConnectClick = (type: string, index: number) => {
    ReactGA.event({ category: EventCategory.Global, action: EventName.ConnectWallet, label: type });
    connectWallet(connectors[index]);
  };
  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      ReactGA.event({ category: EventCategory.Global, action: EventName.LoginSuccess });
      console.log('Login successful', data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Login Failed');
      } else {
        setError('An unexpected error occurred');
      }
      ReactGA.event({ category: EventCategory.Global, action: EventName.LoginFailed });
    } finally {
      setLoading(false);
    }
  };
  if (authMode === 'email') {
    return (
      <EmailAuthForm 
        onBack={() => setAuthMode('wallet')}
        onSuccess={handleEmailLogin} 
      />
    );
  }

  return (
    <div className="flex-center-y p-6">
      <h4 className="text-xl font-medium">Connect wallet</h4>
      <div className="mt-6 grid grid-cols-2 gap-3 px-4">
        <Button type="bordered" className="flex-center col-span-2 gap-2" onClick={() => onConnectClick('meta_mask', 0)}>
          <img className="h-7.5 w-7.5" src="/img/metamask@2x.png" alt="meta_mask" />
          <span className="text-sm">MetaMask</span>
        </Button>
        <Button type="bordered" className="flex-center gap-2" onClick={() => onConnectClick('token_pocket', 1)}>
          <img className="h-7.5 w-7.5" src="/img/tokenPocket.png" alt="TokenPocket" />
          <span className="text-sm">TokenPocket</span>
        </Button>
        <Button type="bordered" className="flex-center gap-2" onClick={() => onConnectClick('bitget_wallet', 2)}>
          <img className="h-7.5 w-7.5" src="/img/bitgetWallet.png" alt="BitgetWallet" />
          <span className="text-sm">Bitget Wallet</span>
        </Button>
        <Button type="bordered" className="flex-center gap-2 px-6" onClick={() => onConnectClick('particle_network', 3)}>
          <img className="h-7.5 w-7.5" src="/img/particleNetwork.png" alt="ParticleNetwork" />
          <span className="whitespace-nowrap text-sm">Particle Network</span>
        </Button>
        <Button type="bordered" className="flex-center gap-2" onClick={() => onConnectClick('wallet_connect', 4)}>
          <img className="h-7.5 w-7.5" src="/img/walletconnet.png" alt="wallet_connect" />
          <span className="text-sm">WalletConnect</span>
        </Button>
      </div>
      <div className="mt-4 px-4 text-xs text-gray">
        {downloadClick ? 'Please refresh page after installation. Re-install ' : "Don't have one? "}
        <span
          className="cursor-pointer text-blue"
          onClick={() => {
            setDownloadClick(true);
            setWalletType?.(WalletType.DOWNLOAD);
          }}
        >
          click here
        </span>
      </div>
      
      <button
        className="text-blue hover:underline text-sm mt-4"
        onClick={() => setAuthMode('email')}
      >
        Or sign in with email
      </button>
    </div>
  );
}

export default React.memo(WalletConnect);