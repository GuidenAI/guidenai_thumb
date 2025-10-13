import React from "react";
import { z } from "zod";
import { CustomLogo, logoOptions } from "../components/CustomLogo";
import { ILayout } from "./types";
import { GradientBackground } from "./utils";

const starterLayoutConfig = z.object({
  Name: z.string().default(""),
  URL: z.string().nullish(),
  IconURL: z.string().default(""),
  Icon: z.enum(["Show", "Hide"]).default("Show"),
  Platform: z.enum(["GuidenAI", "BroxiAI"]).default("GuidenAI"),
  Logo: z.enum([
    "guidenai-dark",
    "guidenai-light", 
    "guidenai-colored",
    "broxi-dark",
    "broxi-light",
    "broxi-colored"
  ] as const).default("guidenai-light"),
});

export type BlogLayoutConfig = z.infer<typeof starterLayoutConfig>;

const Component: React.FC<{ config: BlogLayoutConfig & { isServerSide?: boolean } }> = ({ config }) => {
  const iconURL = config.IconURL || `https://devicons.railway.app/${config.Name || "GuidenAI"}?variant=light`;
  const hideIcon = config.Icon === "Hide";

  return (
    <div tw="relative flex justify-start items-end w-full h-full text-white">
      {/* gradient layers */}
      <GradientBackground />

      {/* main text */}
      <div
        tw="flex flex-col text-left font-bold"
        style={{ maxWidth: 800, marginLeft: 96, marginBottom: 80 }}
      >
        {!hideIcon && (
          <img tw="mb-10" style={{ width: 108, height: 108 }} src={iconURL} />
        )}

        <p tw="flex flex-wrap text-7xl" style={{ lineHeight: 1.5 }}>
          Deploy{" "}
          <span tw="mx-3" style={{ color: "#C049FF" }}>
            {config.Name}
          </span>
          <br />
          on {config.Platform}
        </p>
      </div>

      {config.URL && (
        <div tw="absolute right-20 bottom-8 text-lg opacity-40">
          {config.URL}
        </div>
      )}

      {/* custom logo */}
      <CustomLogo
        logo={config.Logo}
        tw="absolute"
        style={{ top: 66, right: 96, width: 60, height: 60 }}
        isServerSide={config.isServerSide}
      />
    </div>
  );
};

export const starterLayout: ILayout<typeof starterLayoutConfig> = {
  name: "starter",
  config: starterLayoutConfig,
  properties: [
    {
      name: "Name",
      type: "text",
      default: "BlitzJS",
      placeholder: "Starter title",
    },
    {
      name: "URL",
      type: "text",
      placeholder: "github.com/railwayapp/starters",
    },
    {
      name: "IconURL",
      type: "text",
      default: "",
      placeholder: "Custom icon URL (optional)",
    },
    {
      name: "Icon",
      type: "select",
      options: ["Show", "Hide"],
      default: "Show",
    },
    {
      name: "Platform",
      type: "select",
      options: ["GuidenAI", "BroxiAI"],
      default: "GuidenAI",
    },
    {
      name: "Logo",
      type: "select",
      default: "guidenai-light",
      options: logoOptions.map(option => option.value),
    },
  ],
  Component,
};
