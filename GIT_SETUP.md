# 🔑 Git Authentication Setup

## Problem
GitHub requires a Personal Access Token (not password) for HTTPS authentication.

## Quick Solution - Use Your GitHub Token

Since you already have a GitHub token, we can use it for authentication:

### Option 1: Use Token as Password
When Git asks for password, use your GitHub token:
```
Username: mathewfingz
Password: [YOUR_GITHUB_TOKEN_HERE]
```

### Option 2: Configure Git with Token
```bash
cd "/Users/mateotarazona/Downloads/NEw design"

# Remove current remote
git remote remove origin

# Add remote with token embedded
git remote add origin https://mathewfingz:[YOUR_TOKEN]@github.com/mathewfingz/plataforma-ecommerce.git

# Push
git push -u origin main
```

### Option 3: Alternative - Upload via GitHub Web
1. Go to: https://github.com/mathewfingz/plataforma-ecommerce
2. Click "uploading an existing file"
3. Drag and drop the entire project folder
4. Commit directly on GitHub

## Next Steps After Upload
1. Go to Vercel.com
2. Import the repository
3. Deploy with these settings:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Environment Variables:
     ```
     NEXTAUTH_SECRET=to1xFBDt85eNw8GlkcZvoNa9mTFOeh3aKBpChv1a058=
     NEXTAUTH_URL=https://your-project.vercel.app
     NODE_ENV=production
     ```

---
**Choose the option that works best for you!**