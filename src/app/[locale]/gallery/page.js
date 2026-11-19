import { getMessages } from "@/lib/i18n";
import { getLivePosts } from "@/lib/content";
import { localizedField } from "@/lib/localize";
import { mediaUrl, thumbnailUrl, isVideo } from "@/lib/media";
import { SITE_URL, BUSINESS_NAME } from "@/lib/site";
import SectionHeading from "../components/SectionHeading";
import GalleryClient from "../components/GalleryClient";

/** Build BreadcrumbList JSON-LD for gallery page. */
function buildBreadcrumbJsonLd({ locale }) {
  const base = SITE_URL;
  const crumbs = [
    { position: 1, name: "Home", url: `${base}/${locale}` },
    { position: 2, name: "Gallery", url: `${base}/${locale}/gallery` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c) => ({
      "@type": "ListItem",
      position: c.position,
      name: c.name,
      item: c.url,
    })),
  };
}

/** Build ItemList + ImageObject/VideoObject JSON-LD for gallery items. */
function buildGalleryJsonLd({ locale, items, t }) {
  const base = SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${base}/${locale}/gallery#list`,
    name: t.gallery.heading,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: item.kind === "video"
        ? {
            "@type": "VideoObject",
            "@id": `${base}/${locale}/gallery#${item.id}`,
            name: item.title || "Matoshree Fruits gallery video",
            description: item.title || "",
            thumbnailUrl: item.thumb,
            contentUrl: item.url,
            uploadDate: item.publishedAt,
          }
        : {
            "@type": "ImageObject",
            "@id": `${base}/${locale}/gallery#${item.id}`,
            name: item.title || "Matoshree Fruits gallery photo",
            description: item.title || "",
            contentUrl: item.url,
            thumbnailUrl: item.thumb,
            datePublished: item.publishedAt,
          },
    })),
  };
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);
  return { title: t.gallery.heading, description: t.gallery.sub };
}

export default async function GalleryPage({ params, searchParams }) {
  const { locale } = await params;
  const { post: initialPostId = "" } = await searchParams;
  const t = getMessages(locale);

  // Only live (published + not expired) posts — expired media never renders.
  const posts = await getLivePosts({ limit: 60, withMediaOnly: true });

  const items = posts.flatMap((post) =>
    (post.media || []).map((m, i) => ({
      id: `${post._id}-${i}`,
      postId: String(post._id),
      kind: isVideo(m) ? "video" : "image",
      url: mediaUrl(m),
      thumb: thumbnailUrl(m, 600) || mediaUrl(m),
      title: localizedField(post, locale, "title"),
      publishedAt: post.publishedAt || null,
      expiresAt: post.type === "temporary" ? post.expiresAt : null,
    }))
  );

  // Build JSON-LD schemas
  const breadcrumbJsonLd = JSON.stringify(buildBreadcrumbJsonLd({ locale })).replace(/</g, "\\u003c");
  const galleryJsonLd = JSON.stringify(buildGalleryJsonLd({ locale, items, t })).replace(/</g, "\\u003c");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: galleryJsonLd }}
      />
      <SectionHeading
        eyebrow={t.meta.tagline}
        title={t.gallery.heading}
        subtitle={t.gallery.sub}
      />
      <GalleryClient
        items={items}
        locale={locale}
        t={t}
        initialPostId={String(initialPostId)}
      />
    </div>
  );
}