# EcoNest AI

A modern React application with authentication, dashboard, and automated testing.

## Project info

**URL**: https://lovable.dev/projects/5dc03805-2bbe-4bf6-ab31-f180466b72b5

## Features

- 🔐 User Authentication with Supabase
- 📊 Dashboard with KPI analytics  
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🧪 Automated Testing with Vitest
- 📱 Responsive Design
- 🔍 Role-based Access Control

## Testing

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode  
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

1. **Home Page** (`/`) - Landing page with navigation
2. **Authentication** (`/auth`) - Sign up/sign in flows
3. **Dashboard** (`/dashboard`) - Protected main app (requires auth)
4. **Public Pages** - Services, Pricing, Contact (all have back buttons)
5. **Admin Panel** (`/admin`) - Admin-only section

### Creating Test Users

**Via Auth Page:**
1. Go to `/auth` 
2. Create account with email/password
3. To promote to admin: Supabase Dashboard → Auth → Users → Edit role

**Test User Credentials:**
- Create your own test accounts via the signup flow
- Use real email addresses for magic link testing

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5dc03805-2bbe-4bf6-ab31-f180466b72b5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5dc03805-2bbe-4bf6-ab31-f180466b72b5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
