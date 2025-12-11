import './globals.css';
import { AuthContextProvider } from '@/lib/context/authContext.js';

export const metadata = {
  title: 'Flood Tunnel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthContextProvider>
          <div className="flex">
            <main className="min-w-screen flex flex-1">
              {children}
            </main>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
