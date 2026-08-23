import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://gurudeep-portfolio.vercel.app/logo.webp",
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to update or create meta tag
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const attrName = selector.includes("name=")
          ? "name"
          : selector.includes("property=")
          ? "property"
          : "name";
        const attrVal = selector.match(/["']([^"']+)["']/)?.[1] || "";
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Helper to update or create link tag
    const updateLinkTag = (rel: string, href: string, type?: string) => {
      let element = document.querySelector(`link[rel='${rel}']`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
      if (type) {
        element.setAttribute("type", type);
      }
    };

    // Update standard meta tags
    updateMetaTag("meta[name='description']", "content", description);
    if (keywords) {
      updateMetaTag("meta[name='keywords']", "content", keywords);
    }

    // Update Open Graph tags
    updateMetaTag("meta[property='og:title']", "content", title);
    updateMetaTag("meta[property='og:description']", "content", description);
    updateMetaTag("meta[property='og:image']", "content", ogImage);
    updateMetaTag("meta[property='og:image:width']", "content", "1200");
    updateMetaTag("meta[property='og:image:height']", "content", "630");

    // Update Twitter Card tags
    updateMetaTag("meta[name='twitter:title']", "content", title);
    updateMetaTag("meta[name='twitter:description']", "content", description);
    updateMetaTag("meta[name='twitter:image']", "content", ogImage);

    // Update Favicons
    updateLinkTag("icon", "/logo.webp", "image/webp");
    updateLinkTag("shortcut icon", "/logo.webp", "image/webp");
    updateLinkTag("apple-touch-icon", "/logo.webp", "image/webp");

    // Update Canonical URL link tag if provided
    if (canonicalUrl) {
      updateLinkTag("canonical", canonicalUrl);
    }
  }, [title, description, keywords, canonicalUrl, ogImage]);

  return null;
};

export default SEOHead;
