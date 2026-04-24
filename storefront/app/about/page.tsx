import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import config from '@/config.json'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <h1 className="section-heading mb-8">About Us</h1>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          This page is coming soon. For any questions please reach out to us directly.
        </p>
        <div className="flex flex-col gap-3 mt-6">
          <a href={`mailto:${config.contact.supportEmail}`}
            className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
            Email Us
          </a>
          <a href={`https://wa.me/${config.contact.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank" rel="noopener noreferrer"
            className="btn-outline inline-flex" style={{ width: 'fit-content' }}>
            WhatsApp Us
          </a>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
