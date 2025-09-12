# MedSync - Healthcare Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that provides a comprehensive healthcare management system with full internationalization support.

## Features

- **Multi-language Support**: English and Arabic with RTL (Right-to-Left) support
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and registration system
- **Appointment Management**: Book and manage medical appointments
- **Department Directory**: Browse medical departments and specialists
- **Dashboard**: Personalized dashboard for patients and doctors
- **Real-time Notifications**: Stay updated with appointment reminders
- **Dark Mode**: Toggle between light and dark themes

## Internationalization (i18n)

This project includes comprehensive localization support using `i18next` and `react-i18next`:

### Supported Languages
- **English (en)**: Default language with LTR (Left-to-Right) layout
- **Arabic (ar)**: Full RTL support with proper text direction and layout adjustments

### Language Features
- **Automatic Detection**: Detects user's browser language preference
- **Persistent Storage**: Remembers user's language choice in localStorage
- **RTL Support**: Complete right-to-left layout support for Arabic
- **Dynamic Switching**: Change language without page reload
- **Fallback System**: Falls back to English if translation is missing

### Adding New Languages

To add a new language to the project:

1. **Create Translation File**: Add a new JSON file in the `messages/` directory (e.g., `fr.json` for French)

2. **Update i18n Configuration**: Modify `src/lib/i18n.ts` to include the new language:
```typescript
const resources = {
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
  fr: { translation: frTranslations }, // Add new language
};
```

3. **Add Language Option**: Update the language switcher in `src/components/Lang.tsx` to include the new language option

4. **RTL Support** (if needed): If the new language is RTL, add RTL-specific CSS classes in `src/app/globals.css`

### Translation File Structure

Translation files are organized in a hierarchical structure:

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "save": "Save"
  },
  "auth": {
    "title": "Welcome Back",
    "signIn": "Sign In"
  },
  "dashboard": {
    "welcomeBack": "Welcome back, {{name}}!",
    "upcomingAppointments": "Upcoming Appointments"
  }
}
```

### Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('dashboard.welcomeBack', { name: 'John' })}</p>
    </div>
  );
}
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
