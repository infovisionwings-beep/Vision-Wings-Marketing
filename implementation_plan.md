# Implement Password Reset Flow

The goal is to add a "Forgot Password" flow to the application. You've provided a Resend API key to handle the email delivery.

## Open Questions
> [!IMPORTANT]
> Since we are using **Neon Auth** as a managed authentication service, Neon Auth actually handles sending the password reset emails automatically from its own backend when we trigger a reset request. 
> 
> Because of this, **we cannot directly use your Resend API key to send the reset password email from our Next.js codebase**. The email is dispatched by the Neon Auth servers (which use their own configured email provider). 
> 
> **How would you like to proceed?**
> 1. **(Recommended)** I can build the `/forgot-password` and `/reset-password` UI pages and wire them up to Neon Auth's built-in password reset system. I will still save your Resend API key into the project so you can use it for other things (like Welcome emails or Contact form submissions).
> 2. If you absolutely must use Resend for password resets, we would need to migrate away from managed Neon Auth to a self-hosted authentication solution (like raw Better Auth or NextAuth) so we have full control over the email backend. (This is a large architectural change).

## Proposed Changes

### Environment Variables
#### [MODIFY] `.env.local`
- Add `RESEND_API_KEY=re_cn7ZNSXm_GWN8EfM5kaDiGiMs8g1i3kJc`
- Add `resend` to `package.json`

### Authentication UI
#### [MODIFY] `app/login/page.tsx`
- Add a "Forgot Password?" link below the password input that directs users to `/forgot-password`.

#### [NEW] `app/forgot-password/page.tsx`
- Create a premium UI matching the login page theme.
- Includes an email input field and a submit button.
- Submits a request to `authClient.forgetPassword({ email })`.

#### [NEW] `app/reset-password/page.tsx`
- Create a premium UI to accept a new password.
- Extracts the reset `token` from the URL search parameters.
- Submits the new password using `authClient.resetPassword({ newPassword, token })`.

### Utility (Optional integration)
#### [NEW] `lib/email.ts`
- Initialize the Resend SDK with the provided API key so you have it ready for future transactional emails.

## Verification Plan
1. Ensure the UI matches the exact premium styling of the website.
2. Verify that clicking "Forgot Password" routes correctly.
3. Test that submitting an email triggers the correct Neon Auth SDK method without errors.
