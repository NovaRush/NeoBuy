# 🐍 The Hissing Mambas - Patrol 3

A modern, responsive website for the Hissing Mambas Scout Patrol.

## Features

- **Responsive Design**: Mobile-first approach that works on all devices
- **Patrol Chant Section**: Animated call-and-response chant display
- **Members Grid**: Card-based layout showcasing all patrol members with their roles
- **Sticky Navigation**: Easy navigation with smooth scroll animations
- **Modern Styling**: Green and black scouting theme with smooth animations

## Project Structure

```
├── index.html       # Main HTML file
├── style.css        # Stylesheet with responsive design
├── script.js        # JavaScript for animations and interactions
├── server.js        # Local Node.js server (for development)
├── CNAME            # Custom domain configuration
└── README.md        # This file
```

## Local Development

To run the website locally:

```bash
node server.js
```

Then open your browser to `http://localhost:8000`

## Deployment to GitHub Pages

1. **Create a GitHub repository**:
   - Go to [github.com/new](https://github.com/new)
   - Create a new repository named `the-hissing-mambas` (or any name you prefer)

2. **Initialize Git and push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Hissing Mambas website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/the-hissing-mambas.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and save

4. **Configure Custom Domain** (requires domain ownership):
   - In repository settings → Pages section
   - Add custom domain: `the-hissing-mambas.oow-scouts.com`
   - GitHub will create/update the CNAME file
   - Add DNS records to your domain registrar pointing to GitHub Pages

5. **DNS Configuration**:
   After purchasing `oow-scouts.com`, add these DNS records to your registrar:
   ```
   Type: CNAME
   Name: the-hissing-mambas
   Value: YOUR_USERNAME.github.io
   ```

## Website Sections

- **Header**: Welcome section with patrol name and slogan
- **Chant**: Interactive patrol chant call-and-response
- **Members**: All 12 patrol members with their roles (Patrol Leader, Deputy Patrol Leader, or Patrol Member)
- **About**: Information about the patrol
- **Footer**: Patrol branding

## Customization

Feel free to modify:
- Colors in `style.css`
- Content in `index.html`
- Animations in `script.js`

---

**Strike Fast, Strike First!** ⚡ **We strike and win!** 🐍