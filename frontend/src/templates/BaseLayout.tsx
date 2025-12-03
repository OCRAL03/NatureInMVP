import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Page from './Page'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Page>
        {children}
      </Page>
      <Footer />
    </div>
  )
}
