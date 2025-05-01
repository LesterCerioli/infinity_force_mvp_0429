import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import QRCode from 'qrcode';
import { useAccount } from 'wagmi';
import classNames from 'classnames';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import dynamic from 'next/dynamic';
import { posterCaptureAtom, posterStylesAtom } from '@/store/poster/state';
import { formatMinutes, getSteamGameImage, shortenSteamId } from '@/utils';
import { GenesisRarity, GenesisClaim } from '@/constants';
import { referralCodeAtom } from '@/store/invite/state';
import PosterGameItem from './PosterGameItem';
import { GamerGamesData, GamerInfoData } from '@/lib/types';


function PosterCanvasCore({ gamerInfo, gamerGames }: { gamerInfo?: GamerInfoData; gamerGames?: GamerGamesData }) {
  const { address } = useAccount();
  const referralCode = useRecoilValue(referralCodeAtom);
  const posterStyles = useRecoilValue(posterStylesAtom);
  const setPosterCapture = useSetRecoilState(posterCaptureAtom);
  const [qrCode, setQrCode] = useState('');
  const [link, setLink] = useState('');
  const [html2canvas, setHtml2Canvas] = useState<any>(null);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('./html2canvas.min').then((module) => {
        setHtml2Canvas(module.default);
      });
    }
  }, []);

  const steamInfo = useMemo(() => {
    if (!gamerInfo) return [];
    return [
      { label: 'Level', value: gamerInfo.level },
      { label: 'Years', value: gamerInfo.time_created ? dayjs.unix(gamerInfo.time_created).format('YYYY') : '' },
      { label: 'Friends', value: gamerInfo.friends_count },
      { label: 'Badge', value: gamerInfo.badges_count },
    ];
  }, [gamerInfo]);

  const inventoriesValue = useMemo(
    () => [
      { name: 'CS: GO', img: getSteamGameImage(730), value: gamerInfo?.csgo_value },
      { name: 'DOTA 2', img: getSteamGameImage(570), value: gamerInfo?.dota2_value },
      { name: 'TF 2', img: getSteamGameImage(440), value: gamerInfo?.tf2_value },
    ],
    [gamerInfo?.csgo_value, gamerInfo?.dota2_value, gamerInfo?.tf2_value],
  );

  useEffect(() => {
    setPosterCapture('');
  }, [address, setPosterCapture]);

  useEffect(() => {
    setLink(window.location.host + '/?code=' + referralCode);
    QRCode.toDataURL(window.location.origin + '/?code=' + referralCode, { margin: 2 }).then((url: string) => setQrCode(url));
  }, [referralCode]);

  useEffect(() => {
    if (!html2canvas) return;

    const capture: HTMLElement | null = document.querySelector('#poster-capture');
    if (!capture || !gamerGames) return;
    if (gamerInfo?.nft_claim !== GenesisClaim.Claimed || gamerInfo?.nft_level === GenesisRarity.Rekt) return;

    html2canvas(capture, {
      useCORS: true,
      allowTaint: true,
      scale: 1,
      logging: false,
    }).then((canvas: HTMLCanvasElement) => {
      const img = canvas.toDataURL('image/jpeg', 0.85);
      setPosterCapture(img);
    });
  }, [gamerGames, gamerInfo?.nft_claim, gamerInfo?.nft_level, html2canvas, setPosterCapture]);

  if (gamerInfo?.nft_claim !== GenesisClaim.Claimed || gamerInfo?.nft_level === GenesisRarity.Rekt) return null;

  return (
    <div
      id="poster-capture"
      className={classNames('fixed -z-10 w-[1080px] bg-cover px-[54px] py-[60px]', posterStyles[gamerInfo?.nft_level || 0].bg)}
    >
      
      <div className="flex items-start justify-between">
        {/* ... todo o conteúdo atual ... */}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PosterCanvasCore), {
  ssr: false,
  loading: () => null,
});