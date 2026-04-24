import { redirect } from 'next/navigation'

// Signup is handled on the login page with a tab toggle
export default function SignupPage() {
  redirect('/login?mode=signup')
}
