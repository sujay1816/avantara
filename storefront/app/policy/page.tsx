import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import config from '@/config.json'

export default function PolicyPage() {
  return (
    <>
      <Navbar />
      <div className="page-container py-12 max-w-3xl">
        <h1 className="section-heading mb-2">Return & Refund Policy</h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          Last updated: January 2025
        </p>

        {[
          {
            title: '1. Return Eligibility',
            body: `We accept returns within 7 days of delivery. To be eligible for a return, your item must be in the same condition that you received it — unworn and unwashed, with all tags attached and in its original packaging. Sarees must not have been dry cleaned or altered in any way.`,
          },
          {
            title: '2. How to Raise a Return Request',
            body: `To initiate a return:\n1. Log in to your ${config.brand.name} account\n2. Go to My Orders and select the order\n3. Click "Raise Return Request"\n4. Upload a clear photo of the defective or incorrect item\n5. Select your return reason\n6. Submit your request\n\nOur team will review your photo and request within 1–2 business days. Once approved, we will schedule a pickup from your address.`,
          },
          {
            title: '3. Return Review Process',
            body: `Once you submit your return request with the item photo, our quality team will review it carefully. If the return is approved, we will initiate a pickup. If the return is rejected (e.g., due to signs of wear or damage not present at delivery), we will notify you with the reason via email and SMS.`,
          },
          {
            title: '4. Refund Timeline',
            body: `Once we receive and inspect the returned item:\n- UPI/Online payments: Refund within 5–7 business days to the original payment method\n- Cash on Delivery orders: Refund via bank transfer within 7–10 business days (bank details required)\n\nYou will receive an email and SMS notification at each stage of the refund process.`,
          },
          {
            title: '5. Non-Returnable Items',
            body: `The following items cannot be returned:\n- Sarees that have been worn, washed, or dry cleaned\n- Items without original tags or packaging\n- Customized or altered sarees\n- Items purchased during clearance or final sale`,
          },
          {
            title: '6. Damaged or Incorrect Items',
            body: `If you received a damaged or incorrect item, please contact us within 48 hours of delivery with photos. We will prioritize your case and arrange a replacement or full refund at no additional cost to you.`,
          },
          {
            title: '7. Shipping for Returns',
            body: `${config.brand.name} arranges and covers the cost of return pickups for all approved return requests. You do not need to ship the item yourself.`,
          },
          {
            title: '8. Contact Us',
            body: `For any questions about returns or refunds, please reach out to us:\n- Email: ${config.contact.supportEmail}\n- WhatsApp: ${config.contact.whatsappNumber}`,
          },
        ].map((section) => (
          <section key={section.title} className="mb-8">
            <h2 className="text-xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              {section.title}
            </h2>
            <div className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {section.body}
            </div>
          </section>
        ))}
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
