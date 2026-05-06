export interface ExternalMetadata {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  hostname: string;
}

export async function fetchExternalMetadata(url: string): Promise<ExternalMetadata> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    const ogTitle = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i,
    )?.[1];
    const ogDescription = html.match(
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i,
    )?.[1];
    const ogImage = html.match(
      /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i,
    )?.[1];

    const metaDescription = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
    )?.[1];
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];

    const faviconLink = html.match(
      /<link[^>]*rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']*)["']/i,
    )?.[1];
    let faviconUrl: string | undefined;

    if (faviconLink) {
      if (faviconLink.startsWith("http")) {
        faviconUrl = faviconLink;
      } else if (faviconLink.startsWith("//")) {
        faviconUrl = parsedUrl.protocol + faviconLink;
      } else if (faviconLink.startsWith("/")) {
        faviconUrl = `${parsedUrl.protocol}//${hostname}${faviconLink}`;
      } else {
        faviconUrl = `${parsedUrl.protocol}//${hostname}/${faviconLink}`;
      }
    } else {
      faviconUrl = `${parsedUrl.protocol}//${hostname}/favicon.ico`;
    }

    const title = ogTitle || titleTag || hostname;
    const description = ogDescription || metaDescription;
    const image = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${parsedUrl.protocol}//${hostname}${ogImage}`
      : undefined;

    return {
      title,
      description,
      image,
      favicon: faviconUrl,
      hostname,
    };
  } catch (error) {
    const parsedUrl = new URL(url);
    return {
      title: parsedUrl.hostname,
      hostname: parsedUrl.hostname,
      favicon: `${parsedUrl.protocol}//${parsedUrl.hostname}/favicon.ico`,
    };
  }
}
