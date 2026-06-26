import NextAuthProvider from './providers';
import './globals.css';

export const metadata = {
  title: 'Arogya AI — Your Personal AI Health Companion',
  description: 'Arogya AI transforms complex medical records, lab reports, and hospital data into clear, actionable health insights powered by artificial intelligence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body><NextAuthProvider>{children}</NextAuthProvider></body>
    </html>
  );
}
