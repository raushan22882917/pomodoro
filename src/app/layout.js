// src/app/layout.js
export const metadata = {
  title: 'Pomodoro Timer',
  description: 'A simple Pomodoro timer app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
