import React from "react";
import { z } from "zod";
import { CustomLogo, logoOptions } from "../components/CustomLogo";
import { ILayout } from "./types";

const docsSimpleDarkOceanLayoutConfig = z.object({
  Page: z.string(),
  Url: z.string().nullish(),
  Logo: z.enum([
    "guidenai-dark",
    "guidenai-light", 
    "guidenai-colored",
    "broxi-dark",
    "broxi-light",
    "broxi-colored"
  ] as const).default("guidenai-light"),
});

export type DocsSimpleDarkOceanLayoutConfig = z.infer<typeof docsSimpleDarkOceanLayoutConfig>;

const Component: React.FC<{ config: DocsSimpleDarkOceanLayoutConfig & { isServerSide?: boolean } }> = ({ config }) => {
  const url =
    (config.Url ?? "").trim() === ""
      ? "guidenai.com"
      : (config.Url as string);
  return (
    <div
      tw="relative flex justify-start items-end w-full h-full"
      style={{
        background: `#13111C`,
      }}
    >
      {/* gradient layers */}
      <div
        tw="absolute inset-0"
        style={{
          background:
            "linear-gradient(327.21deg, rgba(0, 5, 75, 0.35) 3.65%, rgba(20, 0, 136, 0) 40.32%)",
        }}
      />
      <div
        tw="absolute inset-0"
        style={{
          background:
            "linear-gradient(245.93deg, #0F172A 0%, #1E293B 36.63%, #334155 100%)",
        }}
      />
      <div
        tw="absolute inset-0"
        style={{
          background:
            "linear-gradient(147.6deg, rgba(58, 19, 255, 0) 29.79%, rgba(98, 19, 255, 0.1) 85.72%)",
        }}
      />

      {/* main text */}
      <div
        tw="flex flex-col text-left border"
        style={{ maxWidth: 740, marginLeft: 96, marginBottom: 90 }}
      >
        <p tw="text-8xl text-white font-bold" style={{ lineHeight: 1.2 }}>
          {config.Page}
        </p>
      </div>

      {/* docs link  */}
      <p
        tw="absolute right-10 bottom-4 text-xl"
        style={{ color: "hsl(0, 0.00%, 100.00%)" }}
      >
        {url}
      </p>

      {/* custom logo */}
      <CustomLogo logo={config.Logo} tw="absolute" style={{ top: 106, right: 97 }} isServerSide={config.isServerSide} />
    </div>
  );
};

export const docsSimpleDarkOceanLayout: ILayout<typeof docsSimpleDarkOceanLayoutConfig> = {
  name: "docs-simple-dark-ocean",
  config: docsSimpleDarkOceanLayoutConfig,
  properties: [
    {
      type: "text",
      name: "Page",
      default: "GuidenAI Documentation",
      placeholder: "Text to display",
    },
    {
      type: "text",
      name: "Url",
      default: "guidenai.com",
      placeholder: "Url to display",
    },
    {
      type: "select",
      name: "Logo",
      default: "guidenai-light",
      options: logoOptions.map(option => option.value),
    },
  ],
  Component,
};
