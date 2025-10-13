import React from "react";
import { z } from "zod";
import { DocsIllustration } from "../components/DocsIllustration";
import { CustomLogo, LogoOption, logoOptions } from "../components/CustomLogo";
import { authors, getAuthor } from "./authors";
import { ILayout } from "./types";
import { GradientBackground } from "./utils";

const blogLayoutConfig = z.object({
  Title: z.string(),
  Author: z.string(),
  Theme: z.preprocess(
    v => v?.toString().toLowerCase(),
    z.enum(["light", "dark"]).default("dark"),
  ),
  Logo: z.enum([
    "guidenai-dark",
    "guidenai-light", 
    "guidenai-colored",
    "broxi-dark",
    "broxi-light",
    "broxi-colored"
  ] as const).default("guidenai-dark"),
});

export type BlogLayoutConfig = z.infer<typeof blogLayoutConfig>;

const Component: React.FC<{ config: BlogLayoutConfig & { isServerSide?: boolean } }> = ({ config }) => {
  const author = getAuthor(config.Author);
  const length = config.Title.length;

  return (
    <div
      tw="relative flex justify-start items-end w-full h-full"
      style={{
        color: config.Theme === "light" ? "black" : `white`,
      }}
    >
      {/* gradient layers */}
      <GradientBackground theme={config.Theme} />

      {/* main text */}
      <div
        tw="flex flex-col text-left"
        style={{ maxWidth: 740, marginLeft: 96, marginBottom: 80 }}
      >
        <p
          tw="font-bold"
          style={{ lineHeight: 1.4, fontSize: length > 50 ? 48 : 60 }}
        >
          {config.Title}
        </p>

        <div tw="flex items-center mt-6">
          <img
            src={author.image}
            alt={author.name}
            style={{ borderRadius: "100%", width: 56, height: 56 }}
          />
          <p tw="text-3xl opacity-60 ml-7">{config.Author}</p>
        </div>
      </div>

      {/* custom logo */}
      <CustomLogo
        logo={config.Logo}
        tw="absolute"
        style={{ top: 106, right: 97 }}
        theme={config.Theme}
        isServerSide={config.isServerSide}
      />
      <div tw="absolute top-0 right-0 flex">
        <DocsIllustration />
      </div>
    </div>
  );
};

export const blogLayout: ILayout<typeof blogLayoutConfig> = {
  name: "blog",
  config: blogLayoutConfig,
  properties: [
    {
      type: "text",
      name: "Title",
      default: "Why you should use Config as Code",
      placeholder: "Blog post title",
    },
    {
      type: "select",
      name: "Author",
      default: "Jake Runzer",
      options: authors.map(author => author.name),
    },
    {
      type: "select",
      name: "Theme",
      default: "dark",
      options: ["light", "dark"],
    },
    {
      type: "select",
      name: "Logo",
      default: "guidenai-dark",
      options: logoOptions.map(option => option.value),
    },
  ],
  Component,
};
