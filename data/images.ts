// Photography: Unsplash (free Unsplash License). Shown in the site with an
// ink/blue duotone. Credits are also listed in the README.

export type Photo = { src: string; alt: string; credit: string; url: string };

export const photos = {
  nightTowers: { src: "/images/night-towers.jpg", alt: "Downtown Dubai towers lit at night", credit: "Nejc Soklič", url: "https://unsplash.com/photos/yFKBh1sC1ng" },
  burjDetail: { src: "/images/burj-detail.jpg", alt: "Burj Khalifa illuminated against the night sky", credit: "Clay Banks", url: "https://unsplash.com/photos/XFEJPXUqbYc" },
  stormSkyline: { src: "/images/storm-skyline.jpg", alt: "Downtown Dubai skyline under storm clouds", credit: "Ahmed Aldaie", url: "https://unsplash.com/photos/aKj9uDanF18" },
  towerFacade: { src: "/images/tower-facade.jpg", alt: "Minimal tower facade against a pale sky", credit: "Victor Furtuna", url: "https://unsplash.com/photos/_3asYXeACyo" },
  perforatedTower: { src: "/images/perforated-tower.jpg", alt: "White perforated tower in Dubai", credit: "Yusuf Mansoor", url: "https://unsplash.com/photos/uLDoEsUpukw" },
  arches: { src: "/images/arches.jpg", alt: "White concrete arches framing the Dubai skyline", credit: "Ismail Merad", url: "https://unsplash.com/photos/T9WWuoUwxjA" },
  szrTowers: { src: "/images/szr-towers.jpg", alt: "Towers along Sheikh Zayed Road from above", credit: "Drew McKechnie", url: "https://unsplash.com/photos/5MVnYVqOt14" },
  futureMuseum: { src: "/images/future-museum.jpg", alt: "Museum of the Future and Emirates Towers", credit: "Darcey Beau", url: "https://unsplash.com/photos/q8D7WZc40eA" },
  dawnSkyline: { src: "/images/dawn-skyline.jpg", alt: "Dubai skyline and interchange at dawn", credit: "David Rodrigo", url: "https://unsplash.com/photos/Fr6zexbmjmc" },
  cityStreet: { src: "/images/city-street.jpg", alt: "Business district towers at dusk", credit: "paweldotio", url: "https://unsplash.com/photos/ZyP4Apa8tvI" },
} satisfies Record<string, Photo>;
