import * as React from "react";
import { DefaultSeo, NextSeo, NextSeoProps } from "next-seo";
import Head from "next/head";
import { DefaultSeoProps } from "next-seo";

export interface Props extends NextSeoProps {
  title?: string;
  description?: string;
  image?: string;
}

const title = "GuidenAI OG Image Generator";
export const url = "";
const description = "Service that generates dynamic OG images for guidenai.com";

// Generate OG image for itself
const image =
  "https://thumb.guidenai.com/api/image?fileType=png&layoutName=Railway&Theme=Dark&Title=Open+Graph%5CnImage+Generator&Sub+Title=thumb.guidenai.com";

const config: DefaultSeoProps = {
  title,
  description,
  openGraph: {
    type: "website",
    url,
    site_name: title,
    images: [{ url: image }],
  },
  twitter: {
    handle: "@GuidenAI",
    cardType: "summary_large_image",
  },
};

export const SEO: React.FC<Props> = ({ image, ...props }) => {
  const title = props.title ?? config.title;
  const description = props.description || config.description;

  return (
    <>
      <DefaultSeo {...config} />

      <NextSeo
        {...props}
        {...(image == null
          ? {}
          : {
              openGraph: {
                images: [{ url: image }],
              },
            })}
      />

      <Head>
        <title>{title}</title>

        <meta name="description" content={description} />
      </Head>
    </>
  );
};
