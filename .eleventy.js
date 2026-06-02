const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("uploads");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat("dd MMMM yyyy");
  });
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toISO();
  });
  eleventyConfig.addFilter("shortMonth", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat("MMM").toUpperCase();
  });
  eleventyConfig.addFilter("day", (dateObj) => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat("dd");
  });
  eleventyConfig.addFilter("sortByDate", (arr) => {
    if (!arr) return [];
    return arr.slice().sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });
  eleventyConfig.addFilter("activeOnly", (arr) => {
    if (!arr) return [];
    return arr.filter(item => item.data.active !== false);
  });
  eleventyConfig.addFilter("upcoming", (arr) => {
    if (!arr) return [];
    return arr.filter(item => item.data.status === "upcoming");
  });
  eleventyConfig.addFilter("past", (arr) => {
    if (!arr) return [];
    return arr.filter(item => item.data.status === "past");
  });
  eleventyConfig.addFilter("featured", (arr) => {
    if (!arr) return [];
    return arr.filter(item => item.data.featured === true);
  });
  eleventyConfig.addFilter("pinned", (arr) => {
    if (!arr) return [];
    return arr.filter(item => item.data.pinned === true);
  });
  eleventyConfig.addFilter("slice", (arr, start, end) => {
    if (!arr) return [];
    return arr.slice(start, end);
  });
  eleventyConfig.addFilter("truncate", (str, len) => {
    if (!str) return "";
    return str.length > len ? str.slice(0, len) : str;
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
