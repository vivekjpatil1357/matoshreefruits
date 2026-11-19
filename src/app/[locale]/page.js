import Link from "next/link";
import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { getLivePosts, getStockItems, getApprovedFeedback } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { CONTACT } from "@/lib/site";
import { mediaUrl, thumbnailUrl, isVideo } from "@/lib/media";
import { localizedField, formatDate } from "@/lib/localize";
import SectionHeading from "./components/SectionHeading";
import StockCard from "./components/StockCard";
import PostCard from "./components/PostCard";
import WhatsAppButton from "./components/WhatsAppButton";
import EmptyState from "./components/EmptyState";
import Stars from "./components/Stars";
import {
  ArrowRightIcon,
  BoxIcon,
  ShieldIcon,
  TruckIcon,
  PhoneIcon,
} from "./components/Icons";

const WHY_ICONS = [BoxIcon, ShieldIcon, TruckIcon];

export default async function HomePage({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);
  const phoneHref = CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, "")}` : "";

  const [posts, stock, feedback, heroPosts] = await Promise.all([
    getLivePosts({ limit: 4 }),
    getStockItems({ limit: 3, availableOnly: true }),
    getApprovedFeedback({ limit: 3 }),
    getLivePosts({ limit: 4, withMediaOnly: true }),
  ]);

  // Newest stills for the hero prints (videos are skipped — stills crossfade).
  const heroImages = heroPosts
    .flatMap((post) =>
      (post.media || [])
        .filter((m) => !isVideo(m))
        .map((m) => ({
          src: thumbnailUrl(m, 900) || mediaUrl(m),
          alt: localizedField(post, locale, "title"),
        }))
    )
    .filter((im) => im.src)
    .slice(0, 4);
  const bentoImages = heroImages.slice(0, 3);

  return (
    <>
      {/* ── Hero: two prints in darkness ────────────────────── */}
      <section className="relative overflow-hidden bg-field text-white">
        <Image
          src="/hero-leaves.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-40 blur-[2px] saturate-75"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#143019]/75" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-14 pt-6 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:items-stretch lg:gap-x-6 lg:pb-16 lg:pt-10">
          {/* Content stack: headline, sentence, live stock strip, actions */}
          <div className="order-2 flex flex-col lg:order-1 lg:col-span-5 lg:justify-end">
            <h1 className="text-[clamp(1.75rem,2.5vw,2.5rem)] font-medium leading-[1.15] tracking-tight text-white">
              {t.hero.heading}
            </h1>
            <p className="mt-4 max-w-[40ch] text-base leading-relaxed text-white/75">
              {t.hero.sub}
            </p>

            {/* Live stock strip — the page's live thing, on every screen */}
            <div className="mt-7 bg-surface p-4 text-foreground sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-base font-semibold text-brand-dark">
                  {t.home.stockPreview.title}
                </h2>
                <Link
                  href={`/${locale}/stock`}
                  className="shrink-0 text-sm font-semibold text-brand hover:underline"
                >
                  {t.home.stockPreview.cta}
                </Link>
              </div>
              {stock.length === 0 ? (
                <p className="mt-3 text-sm text-muted">{t.home.stockPreview.empty}</p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {stock.slice(0, 3).map((item) => {
                    const unit = t.stock.units[item.unit] || item.unit;
                    const grade = t.stock.qualities[item.quality] || item.quality;
                    return (
                      <li
                        key={item._id}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"
                      >
                        <span className="text-base font-semibold text-brand-dark">
                          {localizedField(item, locale, "variety")}
                        </span>
                        <span className="text-sm tabular-nums text-muted">
                          {item.quantity} {unit} · {grade} · {item.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
                          {t.common.available}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Two actions, equal weight: WhatsApp solid + Call outline */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton
                href={buildWhatsAppLink(t.whatsapp.greeting)}
                label={t.common.whatsappEnquiry}
                size="lg"
                variant="light"
                className="w-full sm:w-auto"
              />
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="inline-flex w-full items-center justify-center gap-2 border border-white/50 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] sm:w-auto"
                >
                  <PhoneIcon className="h-5 w-5" />
                  {t.common.call}
                </a>
              )}
            </div>
          </div>

          {/* Farmer-direct photo bento; real image count adapts to the published media */}
          <div className="order-1 lg:order-2 lg:col-span-4 lg:col-start-6 lg:mt-[8vh]">
            <div className="grid h-[330px] grid-cols-12 grid-rows-12 gap-2 sm:h-[390px] lg:h-[520px] lg:gap-3">
              {bentoImages[0] ? (
                <div className="relative col-span-7 row-span-8 overflow-hidden">
                  <Image
                    src={bentoImages[0].src}
                    alt={bentoImages[0].alt}
                    fill
                    sizes="(max-width: 1023px) 58vw, 26vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="leaf-field col-span-7 row-span-8" aria-hidden="true" />
              )}
              {bentoImages[1] ? (
                <div className="relative col-span-5 row-span-8 overflow-hidden">
                  <Image
                    src={bentoImages[1].src}
                    alt={bentoImages[1].alt}
                    fill
                    sizes="(max-width: 1023px) 42vw, 20vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="leaf-field col-span-5 row-span-8" aria-hidden="true" />
              )}
              {bentoImages[2] ? (
                <div className="relative col-span-12 row-span-4 overflow-hidden">
                  <Image
                    src={bentoImages[2].src}
                    alt={bentoImages[2].alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 46vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="leaf-field col-span-12 row-span-4" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Fresh arrivals: staggered pairs, hidden when empty ─ */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionHeading
            title={t.home.freshArrivals.title}
            subtitle={t.home.freshArrivals.sub}
            action={
              <Link
                href={`/${locale}/gallery`}
                className="inline-flex shrink-0 items-center gap-1.5 border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:border-brand/40 hover:bg-brand-soft"
              >
                {t.home.freshArrivals.cta}
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            }
          />

          <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {posts.map((post, i) => (
              <div key={post._id} className={i % 2 === 1 ? "sm:mt-14" : ""}>
                <PostCard
                  post={post}
                  locale={locale}
                  t={t}
                  aspect={i % 2 === 1 ? "tall" : "video"}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Stock preview: hidden until lots are listed ─────── */}
      {stock.length > 0 && (
        <section className="border-y border-line bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <SectionHeading
              title={t.home.stockPreview.title}
              subtitle={t.home.stockPreview.sub}
              action={
                <Link
                  href={`/${locale}/stock`}
                  className="inline-flex shrink-0 items-center gap-1.5 border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-brand-dark transition hover:border-brand/40 hover:bg-brand-soft"
                >
                  {t.home.stockPreview.cta}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              }
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stock.map((item) => (
                <StockCard key={item._id} item={item} locale={locale} t={t} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── How it works: drag row of moments ───────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <SectionHeading title={t.home.howItWorks.title} subtitle={t.home.howItWorks.sub} />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {t.home.howItWorks.items.map((item, i) => {
            const Icon = WHY_ICONS[i] || BoxIcon;
            return (
              <div
                key={item.title}
                className="min-w-[80%] snap-start border border-line bg-surface p-6 sm:min-w-[46%] lg:min-w-0"
              >
                <span className="grid h-11 w-11 place-items-center bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand-dark">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials: hidden until feedback exists ──────── */}
      {feedback.length > 0 && (
        <section className="border-y border-line bg-surface/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <SectionHeading
              title={t.home.testimonials.title}
              subtitle={t.home.testimonials.sub}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {feedback.map((item) => (
                <figure
                  key={item._id}
                  className="flex h-full flex-col border border-line bg-surface p-6"
                >
                  <Stars rating={item.rating} />
                  <blockquote className="mt-3 flex-1 text-base leading-relaxed text-foreground">
                    &ldquo;{item.message}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 flex items-center justify-between gap-3 text-[13px] text-muted">
                    <span className="font-semibold text-brand-dark">{item.name}</span>
                    <span>{formatDate(item.createdAt, locale)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="bg-brand px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {t.home.cta.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/85">
            {t.home.cta.text}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton
              href={buildWhatsAppLink(t.whatsapp.greeting)}
              label={t.home.cta.button}
              size="lg"
              variant="light"
            />
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              {t.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
