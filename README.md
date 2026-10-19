# Sarit Choudhary — Portfolio Website

A clean, modern, recruiter-friendly portfolio built with pure **HTML, CSS, and JavaScript** — no frameworks, no build tools. Just open and deploy.

---

## 📁 Project Structure

```
sarit-portfolio/
├── index.html                  ← Main portfolio page
├── style.css                   ← Styles, theming, responsive layout
├── main.js                     ← Interactions and GitHub profile data
├── sarit final resume.pdf      ← Downloadable resume
└── README.md
```

---

## ✅ Before You Go Live — Checklist

### 1. Add Your Resume
Place your resume PDF in the root folder:
```
sarit-portfolio/sarit final resume.pdf
```
The "Download Resume" button links to this file automatically.

### 2. Add Your Profile Photo
To replace the **SC** initials placeholder:

Open `index.html` and find `.photo-placeholder`. Replace it with:
```html
<img src="assets/images/profile.jpg" alt="Sarit Choudhary" class="profile-photo" />
```
Then in `style.css`, add:
```css
.profile-photo {
  width: 340px; height: 380px;
  object-fit: cover; border-radius: 2rem;
}
```

### 3. Connect Contact Form (Optional)
The form currently simulates sending. To make it real:

1. Sign up at [formspree.io](https://formspree.io) (free tier available)
2. Create a new form → get your Form ID
3. In `main.js`, follow the comment at the bottom of the file to wire it up

### 4. Fill in Achievements
Open `index.html`, find the `#achievements` section, and replace the placeholder cards with your real hackathons, certifications, and awards.

### 5. Add More Projects
Duplicate a `.project-card` block in `index.html` and fill in:
- Project name, description, highlights
- Tech stack badges
- GitHub link and Live Demo URL

---

## 🚀 Deploy on GitHub Pages (Free)

### Method 1: Direct Upload
1. Create a new GitHub repository (e.g., `saritchoudhary.github.io`)
2. Upload all files from this folder
3. Go to **Settings → Pages → Source → main branch / root**
4. Your site is live at `https://saritchoudhary.github.io`

### Method 2: Git CLI
```bash
git init
git add .
git commit -m "Initial portfolio deploy"
git remote add origin https://github.com/saritchoudhary/saritchoudhary.github.io.git
git push -u origin main
```
Then enable GitHub Pages from the repository Settings.

---

## 🎨 Customization

### Change Theme Colors
All colors are in CSS variables at the top of `style.css`:
```css
:root {
  --accent: #4fffb0;    /* Green accent → change to your fav color */
  --accent-2: #00c8ff;  /* Blue accent */
  ...
}
```

### Change Typed Text
In `main.js`, edit the `phrases` array:
```js
const phrases = [
  'CSE Student | Cyber Security',
  'Ethical Hacker in Training',
  // Add your own...
];
```

### Dark / Light Mode
A toggle button is built in — top right of the navbar. User preference is saved in `localStorage`.

---

## 🔧 Features

| Feature | Status |
|---|---|
| Dark / Light theme toggle | ✅ |
| Typed text animation | ✅ |
| Interactive "get to know me" intro | ✅ |
| Scroll reveal animations | ✅ |
| Active nav link highlight | ✅ |
| GitHub API integration | ✅ |
| Live repository cards | ✅ |
| Responsive (mobile + desktop) | ✅ |
| Sticky navbar | ✅ |
| Resume download button | ✅ |
| Contact form | ✅ (opens a prefilled email draft) |
| Smooth scroll | ✅ |

---

## 📦 No Dependencies
Zero npm, zero build step. Everything runs directly in the browser.
Google Fonts are loaded via CDN — works offline if fonts are cached.

---

**Made with ♥ for Sarit Choudhary**
