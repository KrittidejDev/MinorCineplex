import Head from "next/head";
import { useRouter } from "next/router";

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  url?: string;
  type?: string;
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
  robots?: string;
  customMetaTags?: { name: string; content: string }[];
  movieGenre?: string;
  releaseDate?: string;
  director?: string;
}

const defaultProps: Partial<SEOProps> = {
  type: "website",
  siteName: "MinorCineplex",
  locale: "th",
  robots: "index,follow",
  imageWidth: 800, // ค่าเริ่มต้นสำหรับภาพแนวตั้ง
  imageHeight: 1200, // ค่าเริ่มต้นสำหรับภาพแนวตั้ง
  imageAlt: "ภาพโปสเตอร์ภาพยนตร์จาก Minorcineplex",
  twitterHandle: "@Minorcineplex",
};

export default function SEO({
  title,
  description = defaultProps.description || "",
  image,
  imageWidth = defaultProps.imageWidth,
  imageHeight = defaultProps.imageHeight,
  imageAlt = defaultProps.imageAlt,
  url,
  type = defaultProps.type,
  siteName = defaultProps.siteName,
  twitterHandle = defaultProps.twitterHandle,
  locale = defaultProps.locale,
  robots = defaultProps.robots,
  customMetaTags = [],
  movieGenre,
  releaseDate,
  director,
}: SEOProps) {
  const router = useRouter();
  // สร้าง URL เต็มรูปแบบถ้าไม่ได้ระบุ url
  const canonicalUrl =
    url || `https://minor-cineplex-phi.vercel.app${router.asPath}`;

  // จำกัดความยาว title และ description เพื่อ SEO และการแชร์
  const sanitizedTitle =
    title.length > 60 ? `${title.substring(0, 57)}...` : title;
  const sanitizedDescription =
    description.length > 160
      ? `${description.substring(0, 157)}...`
      : description;

  return (
    <Head>
      {/* General Meta Tags */}
      <title>{sanitizedTitle} | Minorcineplex</title>
      <meta name="description" content={sanitizedDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={robots} />
      <meta charSet="utf-8" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={sanitizedTitle} />
      <meta property="og:description" content={sanitizedDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={image} />}
      {image && imageWidth && (
        <meta property="og:image:width" content={imageWidth.toString()} />
      )}
      {image && imageHeight && (
        <meta property="og:image:height" content={imageHeight.toString()} />
      )}
      {image && imageAlt && <meta property="og:image:alt" content={imageAlt} />}

      {/* Movie-specific Open Graph Tags */}
      {movieGenre && <meta property="og:video:tag" content={movieGenre} />}
      {releaseDate && (
        <meta property="og:video:release_date" content={releaseDate} />
      )}
      {director && <meta property="og:video:director" content={director} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={sanitizedTitle} />
      <meta name="twitter:description" content={sanitizedDescription} />
      {image && <meta name="twitter:image" content={image} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}

      {customMetaTags.map((tag, index) => (
        <meta
          key={`custom-meta-${index}`}
          name={tag.name}
          content={tag.content}
        />
      ))}
    </Head>
  );
}

SEO.defaultProps = defaultProps;
