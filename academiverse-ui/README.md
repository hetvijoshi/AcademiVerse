This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Unit Tests
The component has been thoroughly tested using Jest and React Testing Library.

### Announcement Component
The test suite includes the following implemented test cases:

1. Basic Rendering
   - Verifies that the announcement page renders with the correct title
   - Confirms the presence of "Course Announcements" text

2. Role-Based Access Control
   - Validates that professors can see the "New Announcement" button
   - Confirms that students cannot see the "New Announcement" button

3. Data Display
   - Verifies announcements are properly displayed when data is available
   - Tests handling of empty announcement data
   - Validates course information display (course code, name)

4. Component Integration
   - Properly integrates with Material UI ThemeProvider
   - Correctly uses mock data for announcements service
   - Handles navigation and routing through mocked hooks
   - Integrates with next-auth for session management

5. Mock Implementation
   - Uses mock announcement data with full course and user details
   - Implements mock services for announcement fetching and saving
   - Mocks next-auth useSession hook for authentication testing
   - Mocks next/navigation hooks for routing functionality

To run the tests:

```bash
npm run test
# or
yarn test
```


