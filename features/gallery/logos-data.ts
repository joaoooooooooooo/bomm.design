/** Temporary editorial selection. Replace with CMS records when connected. */
export type CuratedLogo = {
  id: string;
  name: string;
  image: string;
  source: string;
};

const selection = [
  ["figma", "Figma"], ["airbnb", "Airbnb"], ["spotify", "Spotify"],
  ["slack", "Slack"], ["dropbox", "Dropbox"], ["github", "GitHub"],
  ["ubuntu", "Ubuntu"], ["discord", "Discord"], ["netflix", "Netflix"],
  ["pinterest", "Pinterest"], ["reddit", "Reddit"], ["twitch", "Twitch"],
  ["youtube", "YouTube"], ["vimeo", "Vimeo"], ["soundcloud", "SoundCloud"],
  ["dribbble", "Dribbble"], ["behance", "Behance"], ["sketchapp", "Sketch"],
  ["adobe", "Adobe"], ["firefox", "Firefox"], ["google", "Google"],
  ["microsoft", "Microsoft"], ["apple", "Apple"], ["android", "Android"],
  ["twitter", "Twitter"], ["telegram", "Telegram"], ["whatsapp", "WhatsApp"],
  ["signal", "Signal"], ["evernote", "Evernote"], ["trello", "Trello"],
  ["blender", "Blender"], ["kubernetes", "Kubernetes"], ["medium", "Medium"],
  ["wordpress", "WordPress"], ["shopify", "Shopify"], ["stripe", "Stripe"],
  ["paypal", "PayPal"], ["cloudflare", "Cloudflare"], ["digitalocean", "DigitalOcean"],
  ["docker", "Docker"], ["gitlab", "GitLab"], ["bitbucket", "Bitbucket"],
  ["heroku", "Heroku"], ["netlify", "Netlify"], ["npmjs", "npm"],
  ["mozilla", "Mozilla"], ["duckduckgo", "DuckDuckGo"], ["wikipedia", "Wikipedia"],
] as const;

export const curatedLogos: readonly CuratedLogo[] = selection.map(([id, name]) => ({
  id,
  name,
  image: `https://www.vectorlogo.zone/logos/${id}/${id}-icon.svg`,
  source: `https://www.vectorlogo.zone/logos/${id}/`,
}));
