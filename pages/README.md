# 📁 /pages Folder

This folder is **intentionally left empty**.

## Why it exists

Next.js automatically treats `src/pages` as the **Pages Router** entry point, even when the project uses the **App Router** (`/app` folder).  
To prevent build conflicts between the **App Router** and the legacy **Pages Router**, this empty `/pages` folder is required at the project root.

## Summary

- The project uses the **App Router** located in the root `/app` directory.
- The **FSD (Feature-Sliced Design)** structure lives in `src/`.
- This `/pages` folder exists **only** to stop Next.js from falling back to `src/pages` and breaking the build.

⚠️ **Do not remove this folder** unless Next.js changes this behavior in a future release.
