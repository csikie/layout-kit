/** Public origin of the docs site and registry. */
const productionSiteUrl = "https://layout.csikie.com";

/** Origin of `next dev`, so local pages and registry JSON point at themselves. */
const developmentSiteUrl = "http://localhost:3000";

/** The origin this build serves from, without a trailing slash. */
const siteUrl = process.env.NODE_ENV === "production" ? productionSiteUrl : developmentSiteUrl;

const siteName = "Layout Kit";

/** Source repository on GitHub. */
const repositoryUrl = "https://github.com/csikie/layout-kit";

/** Author credited in the footer and the license. */
const author = { name: "Erik Csiki-Gecse", url: "https://github.com/csikie" };

/** Registry namespace consumers add to their components.json. */
const registryNamespace = "@layout-kit";

export {
  siteUrl,
  productionSiteUrl,
  developmentSiteUrl,
  siteName,
  registryNamespace,
  repositoryUrl,
  author,
};
