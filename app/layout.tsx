export const metadata = {
  metadataBase: new URL('https://classgu.sharettle.com'),
  title: 'ClassGU by Sharettle',
  description: '岐阜大学生のために作られた学びのプラットフォームです。',
  keywords: '岐阜大学生, 大学生, Sharettle, ClassGU',
  author: 'Sharettle.Developer',

  openGraph: {
    title: 'ClassGU by Sharettle',
    description: '岐阜大学生のために作られた学びのプラットフォームです。',
    images: '/favicon.ico',  // Open Graphイメージを指定
    url: 'https://classgu.sharettle.com',
  },
  icons: {
    icon: '/icon.png',
    type: 'image/png',
    sizes: '512x512',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json"/>
      <meta name="google" content="notranslate" />
      <body>{children}</body>
    </html>
  );
}
