# VCFlow: Printer Service and Repair Management

VCFlow is a web application designed to streamline the process of managing printer service and repair requests. It provides separate portals for customers, technicians, and administrators to manage the entire service lifecycle.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Database & Auth**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)

## Getting Started

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn

### 2. Set Up Environment Variables

You will need to connect this project to your own Supabase account.

1.  Create a `.env.local` file in the root of the project.
2.  Add your Supabase project URL and Anon Key to this file:

    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

    You can find these in your Supabase project's "Project Settings" > "API" section.

### 3. Install Dependencies

Open your terminal and run:

```bash
npm install
```

### 4. Run the Development Server

To start the app locally, run:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Hosting Your Website

This is a Next.js application and requires a Node.js environment. While it is technically possible to host it with an Apache server, it requires a complicated setup using a reverse proxy.

For the best performance, security, and ease of use, it is **highly recommended** to deploy this application to a modern hosting platform built for Next.js, such as:

- **Firebase App Hosting**: The recommended choice for projects built in Firebase Studio. It's designed for easy deployment of web apps.
- **Vercel**: The creators of Next.js provide a seamless hosting experience.

Deploying to one of these platforms is typically as easy as connecting your code repository and letting the platform handle the rest.