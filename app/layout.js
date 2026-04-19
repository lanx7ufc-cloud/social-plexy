export const metadata = {
  title: 'Social Plexy',
  description: 'Plataforma de vídeos dark e experimental',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
