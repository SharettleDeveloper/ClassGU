/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,  // 静的エクスポートを行うために必要
  output: 'export', // 静的エクスポートを有効化
  // その他のNext.js設定
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // PWAの設定はここに
})(nextConfig);
