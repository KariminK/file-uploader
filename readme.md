# Reach - A Stripped Down Google Drive Clone

**Reach** is minimialistic file-management platform. It allows users to make accounts, perform CRUD on folders, Upload, view and delete files. Files are stored in Cloudinary, while other info is stored in postgresql database.

# Preview-link

This site is deployed at [Koyeb](https://hard-cassie-karimin-5f90ed6e.koyeb.app/)

## Requirements to run locally

- Postgresql instance
- Cloudinary api key

## How to run

- Clone repository:

```
git clone https://github.com/KariminK/file-uploader.git
```

- Go into repo directory:

```
cd file-uploader
```

- Install dependiences

```
npm install
```

- Create .env file in project's root directory with required variables

```env
PORT=your_port (3000 by default)
DATABASE_URL=your_postgres_database_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

- Run prisma
  `npx prisma migrate dev`

- Build tailwind and start server
  `npm run start`

- Start tailwind (auto build)
  `npm run tailwind-dev`

- Start server (auto restart)
  `npm run dev`

## Known Bugs

- Folders don't recognize their parent folders propertly
