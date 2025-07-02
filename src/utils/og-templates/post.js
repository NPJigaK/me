import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";

export default async post =>
  satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #3ea8ff 0%, #af7af4 100%)",
          color: "#fff",
          padding: "60px 80px",
          boxSizing: "border-box",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                fontSize: 64,
                fontWeight: "bold",
                lineHeight: 1.2,
                overflow: "hidden",
              },
              children: post.data.title,
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                fontSize: 32,
              },
              children: [
                // { type: "span", props: { children: post.data.author } },
                {
                  type: "span",
                  props: {
                    style: { fontWeight: "bold" },
                    children: SITE.title,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFonts(
        post.data.title + post.data.author + SITE.title
      ),
    }
  );
