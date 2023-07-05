import APIError from "@/lib/APIError";
import crypto from "crypto";
import emoji from "unicode-emoji-json";

export const hash = (str: string) =>
  crypto.createHash("sha256").update(str).digest("hex");

export const getEmoji = (name: string) =>
  Object.keys(emoji).find((e) => emoji[e]?.slug === name) ?? "";

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const isDateInFuture = (date: Date | null) => date && date > new Date();

export const apiFetch = (url: string, options: any) =>
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) throw new APIError(res.message, 400);
      return res;
    })
    .catch((err) => {
      if (err instanceof APIError) {
        console.error("Handled error", err);
        throw err;
      } else {
        console.error("Unhandled error", err);
        throw new Error(
          "An unexpected error occurred. Please try again later or contact us if the issue persists."
        );
      }
    });

export const getISODateString = (date: Date) =>
  date.toISOString().split("T")[0];

export const sumObjects = (obj1: any, obj2: any) => {
  const obj: any = {};
  for (const k in obj2) {
    obj[k] = (obj1[k] || 0) + obj2[k];
  }
  return obj;
};
