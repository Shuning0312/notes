# Personal Notes Static Site - Boki's Blog

This is a static personal notes website built with Next.js, inspired by `https://www.huaier-ashgrey.top/`.

## Features

-   **Header Bar:** Includes a button to toggle the sidebar, the blog title "Boki's Blog", and a search button.
-   **Sidebar Toggle:** Click the menu icon (☰) in the header to show or hide the sidebar.
-   **Search Functionality:** Click the search icon (🔍) in the header to open a modal window for searching notes by title or path.
-   **Customizable Sidebar Navigation:** Automatically generated from your notes folder structure, with support for custom ordering and grouping via frontmatter (`order` field).
-   **Markdown Support:** Notes written in Markdown (using `react-markdown` and `remark-gfm`).
-   **Clean Design:** Minimalist layout with light/dark mode support (based on system preference).
-   **Static Generation:** Built for fast performance and easy deployment.

## Local Note Management

Manage your notes locally within the `content` directory.

1.  **Navigate:** Go to the `personal_notes_site/content` directory.
2.  **Organize:**
    *   Create folders for subjects/categories (e.g., `Subject1`, `Mathematics`).
    *   Create sub-folders for chapters/topics (e.g., `content/Mathematics/LinearAlgebra`).
    *   Place Markdown notes (`.md` files) inside the appropriate folders.
3.  **Creating/Editing/Deleting:** Use any text editor to manage your `.md` files.

## Frontmatter & Ordering

You can control the title and order of notes and folders in the sidebar using YAML frontmatter.

**For Files (e.g., `MyNote.md`):**

```markdown
---
title: 'My Custom Note Title' # Optional: Overrides filename as title
order: 1 # Optional: Lower numbers appear first. Default is Infinity (last).
---

# Your Note Content
...
```

**For Folders (using `index.md` or `index.mdx`):**

Create an `index.md` (or `index.mdx`) inside a folder to control its title or order.

Example: `/content/Subject1/index.md`

```markdown
---
title: 'Introduction to Subject 1' # Optional: Sets the folder's display name.
order: 5 # Optional: Controls the folder's position.
---

# Optional Content for the Folder Page
...
```

*   Titles default to filename/foldername if not specified.
*   Items without `order` are placed after ordered items, sorted alphabetically.
*   `About Me.md` is set with `order: 0` to appear first.

## Building the Static Site

After changing notes in the `content` directory, rebuild the site:

1.  **Terminal:** Navigate to the `personal_notes_site` directory.
2.  **Install (if needed):** `pnpm install`
3.  **Build:** `pnpm build`
4.  **Preview (Optional):** `pnpm start` (Serves production build locally, usually at `http://localhost:3000`)

## Deployment

Deploy the output of `pnpm build` (the `.next` directory, potentially adapted for static export if needed) to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

For `shuningsun.top`:
1.  Build the site (`pnpm build`).
2.  Upload build output to your hosting provider.
3.  Configure `shuningsun.top` DNS records to point to your host.


