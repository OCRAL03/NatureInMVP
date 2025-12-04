import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Page from './Page'
import IAWidget from '../components/ui/IAWidget'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Page>
        {children}
      </Page>
      <Footer />
      <IAWidget />
    </div>
  )
}
