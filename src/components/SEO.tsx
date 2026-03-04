import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";

type Props = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

const SITE_NAME = "Met71 Spain";
const SITE_ORIGIN = "https://met71spain.com";
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-met71.jpg`;

export default function SEO({ title, description, path, image, noIndex }: Props) {
  const [loc] = useLocation();
  const pathname = (path ?? loc ?? "/").startsWith("/") ? (path ?? loc ?? "/") : `/${path ?? loc}`;
  const url = `${SITE_ORIGIN}${pathname}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image || DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || DEFAULT_IMAGE} />
    </Helmet>
  );
}
