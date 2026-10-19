// Build settings for the Zenith website. You should not need to touch this file.

const cleanUrl = (u) => String(u || "").trim().replace(/\/+$/, "");

export default function (eleventyConfig) {
  // Files copied to the live site exactly as they are
  eleventyConfig.addPassthroughCopy({
    "src/css": "css",
    "src/js": "js",
    "src/admin": "admin",
    "src/favicon.svg": "favicon.svg",
  });

  // https://example.com/  ->  https://example.com
  eleventyConfig.addFilter("cleanUrl", cleanUrl);

  // "Jane Kato" -> "JK"
  eleventyConfig.addFilter("initials", (name) =>
    String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("")
  );

  // Builds a WhatsApp link with a pre-filled message
  eleventyConfig.addFilter("waUrl", (number, message) => {
    const digits = String(number || "").replace(/\D/g, "");
    return `https://wa.me/${digits}?text=${encodeURIComponent(message || "")}`;
  });

  // Structured data that helps Google understand this is a local business
  eleventyConfig.addFilter("schemaJson", (site) => {
    const url = cleanUrl(site.url);
    const digits = String(site.whatsappNumber || "").replace(/\D/g, "");
    const data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${url}/#business`,
      name: site.name,
      url: `${url}/`,
      description: site.metaDescription,
      telephone: digits ? `+${digits}` : undefined,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: "UG",
      },
      areaServed: { "@type": "City", name: site.city },
    };
    if (Array.isArray(site.social) && site.social.length) {
      data.sameAs = site.social;
    }
    // "<" is escaped so the data can never break out of its script tag
    return JSON.stringify(data).replace(/</g, "\\u003c");
  });

  return {
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
}
