# XBlog - Open Source Project

## Overview

This is an open-source blog application built with Next.js, Prisma, PostgreSQL, and Redux. The project is a learning experience for beginners and those looking to contribute to an open-source project. The app allows users to create, view, and manage blog posts, tags, and user profiles.

This project aims to be a collaborative and beginner-friendly environment for contributors who want to gain experience working on real-world applications. We welcome all contributions, whether bug fixes, new features, or documentation improvements.
**Live preview** [Here](https://blog-app-bay-one.vercel.app/) you can see the live version of the site

## Features

- User authentication and profile management
- Creating, editing, and deleting blog posts
- comments on posts and comments as replyes on other comments
- Category management for organizing posts
- Responsive design using [ShadCN/UI](https://shadcn.dev/)
- User edit profile features

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Auth Solution**: [NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- **Styling**: [ShadCN/UI](https://shadcn.dev/)
- **Testing**
  - Component & unit & integration testing: [Vitest](https://vitest.dev/), [Testing Library](https://testing-library.com/), [MSW](https://mswjs.io/)
  - e2e testing [Playwright](https://playwright.dev/)

## To do list
- [ ] add subscription model, where a user can subscribe to author and get notified everytime when this author creates a new post
- [ ] add push notifications
- [ ] finish the "change language" feature
      - The "Change language" feature is located on the user's profile page, where they can choose their preferred language from a dropdown menu.
- [ ] add test cases
- [ ] add infinity scroll on */posts* page
- [ ] add rich text editor on */create-post* page for the content part
- [ ] add reactions to the post
- [ ] add filtering and displaying authors and categories by their popularity on the home page
- [ ] add optimistic updates
- [ ] add OAuth prvider's accounts should be saved in db 

## How to contribute
We welcome contributions of all kinds! First of all, join our discord server. There, you can see what tasks are left, or you can open a ticket and present your own idea features. Here's how you can get started:

1. [**Join Discord server**](https://discord.gg/4DNwb3rQhZ)
2. **Fork the repository**
3. **Create a new branch:**
```console
git checkout -b feature/your-feature-name
```
5. **Make your changes and commit them:**
```console
git commit -m 'Add your feature
```
7. **Push to your branch:**
```console
git push origin feature/your-feature-name
```
6. **Create a pull request**

### Issues and Feature Requests
If you find a bug or have an idea for a new feature, please check the issues section first to see if it's already being discussed. If not, feel free to open a new issue.

## Getting Started
To run the project locally, follow these steps:

1. **Clone the repository:**
```console
git clone https://github.com/bockster6669/blog-app.git
```
2. **Install dependencies:**
 ```console
npm install
```
3. **Run the development server:**
```console
npm run dev
```
5. **Access the app:** The application should be running at http://localhost:3000.
  **To sign in the app use**: testUser@gmail.com | 1111

## Security
The app is protected from SQL injections by using [Prisma](https://www.prisma.io/orm) as an ORM, which uses parameterized queries by default, reducing the risk of SQL injections and also validating the input
