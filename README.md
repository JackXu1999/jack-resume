# Resume Website
Created by Shengkai Xu, CS undergrad at Emory University, and it has been [published](http://shengkaixu.com/). Using HTML, CSS, Javascript and Bootstarp.

![website snapshot](/img/snapshot.png)

## Local development

With Node.js 22.12 or later in the 22.x series, run `npm ci`, then `npm start` to preview the checked-in site at `http://127.0.0.1:3000`. The preview rebuilds the résumé styles and script before serving the first page and whenever their sources change. Run `npm run build` for a standalone build. Both the build and Pages deployment verify the browser code and fonts in `vendor/` against the locked npm packages. GitHub Pages serves the committed assets, including the browser libraries in `vendor/`.
