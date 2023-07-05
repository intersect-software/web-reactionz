"use client";
import Image from "next/image";
import "./index.css";
import { useEffect, useRef } from "react";
import { Button } from "rsuite";
import SlideInContainer from "@/components/SlideInContainer";
import { signIn } from "next-auth/react";
import logo from "@/public/logo.svg";
import combined from "@/public/webreactionz.svg";
import Script from "next/script";
import ReactionsWidget from "@/components/ReactionsWidget";
import Link from "next/link";

const SCROLL_HEIGHT = 500;

export default function Landing({ isLoggedIn }: { isLoggedIn: boolean }) {
  const refTopLeft = useRef<HTMLDivElement>(null);
  const refTopRight = useRef<HTMLDivElement>(null);
  const refBottomLeft = useRef<HTMLDivElement>(null);
  const refBottomRight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => {
      if (
        window.scrollY > SCROLL_HEIGHT ||
        !refTopLeft?.current ||
        !refTopRight?.current ||
        !refBottomLeft?.current ||
        !refBottomRight?.current ||
        window.innerWidth < 992 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const x = (150 / SCROLL_HEIGHT) * window.scrollY;
      const yTop = -window.scrollY / 5;
      const yBottom = -window.scrollY / 2;
      const opacity = `${1 - window.scrollY / 500}`;

      const rotate1 = 15 + window.scrollY / 7;
      refTopLeft.current.style.transform = `translate(-${x}px, ${yTop}px) rotate(${rotate1}deg)`;
      refTopLeft.current.style.opacity = opacity;

      const rotate2 = -20 - window.scrollY / 7;
      refTopRight.current.style.transform = `translate(${x}px, ${yTop}px) rotate(${rotate2}deg)`;
      refTopRight.current.style.opacity = opacity;

      const rotate3 = 15 + window.scrollY / 7;
      refBottomRight.current.style.transform = `translate(${x}px, ${-yBottom}px) rotate(${rotate3}deg)`;
      refBottomRight.current.style.opacity = opacity;

      const rotate4 = 0 - window.scrollY / 15;
      refBottomLeft.current.style.transform = `translate(-${x}px, ${-yBottom}px) rotate(${rotate4}deg)`;
      refBottomLeft.current.style.opacity = opacity;
    };

    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <div className="bannerAnnouncement">
        😍 Check out the Web Reactionz{" "}
        <Link href="/blog/launch">launch blog post</Link>!
      </div>
      <main className="landing">
        <div className="hero">
          <div className="emoji topLeft" ref={refTopLeft}>
            😍
          </div>
          <div className="emoji topRight" ref={refTopRight}>
            ❤️
          </div>
          <div className="emoji bottomLeft" ref={refBottomLeft}>
            👏
          </div>
          <div className="emoji bottomRight" ref={refBottomRight}>
            👍
          </div>

          <div className="logo">
            <Image src={combined} fill alt="Web Reactionz logo" />
          </div>

          <h1 className="name">Global reactions for the Web</h1>

          <p className="tagline">
            Add customisable anonymous reaction buttons to any website in less
            than a minute.
          </p>

          <p>
            <Button
              appearance="primary"
              size="lg"
              onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
            >
              {isLoggedIn ? "Go to your dashboard" : "Get started now for free"}
            </Button>
          </p>
        </div>

        <SlideInContainer className="features">
          <div className="feature">
            <div className="desc">
              <h2>Lightweight & easy to integrate</h2>
              <p>
                Just insert the &tilde;2kB (gzipped) script to your blog, forum,
                product site, or any website, with only one line of code.
              </p>
            </div>
          </div>

          <div className="feature">
            <div className="desc">
              <h2>Emoji galore</h2>
              <p>
                Choose from hundreds of emoji to capture your visitors&apos;
                reactions.
              </p>
            </div>
            <div id="reactions-wrapper" />
          </div>

          <div className="feature">
            <div className="desc">
              <h2>No-code configuration</h2>
              <p>
                Configure your site&apos;s reactions from the easy-to-use
                dashboard without needing to update code.
              </p>
            </div>
            <Image
              src="/screenshots/edit-page.png"
              width={600}
              height={500}
              alt="WebReactionz dashboard edit UI"
            />
          </div>

          <div className="feature">
            <div className="desc">
              <h2>Analytics Dashboard</h2>
              <p>
                Keep track of reactions received per page over time, including
                daily breakdowns.
              </p>
            </div>
            <Image
              src="/screenshots/daily-reactions.png"
              width={500}
              height={250}
              alt="WebReactionz dashboard 'daily reactions' statistics UI"
            />
          </div>

          <div className="feature">
            <div className="desc">
              <h2>Multiple reactions</h2>
              <p>Engage your audience more by enabling multiple reactions.</p>
            </div>
            <Image
              src="/screenshots/multiclap.gif"
              width={200}
              height={90}
              alt="Clip of a user making multiple reactions on an applause emoji"
            />
          </div>

          <div className="feature">
            <div className="desc">
              <h2>Open-source & self-hostable</h2>
              <p>
                Want to own your data? Self-host on your server with all
                features for free.
              </p>
            </div>
          </div>

          <div className="feature">
            <div className="desc">
              <h2>Advanced configuration</h2>
              <p>
                Customise your widget&apos;s look and behaviour further using
                JavaScript and CSS.
              </p>
            </div>
          </div>
        </SlideInContainer>

        <SlideInContainer className="pricing">
          <h2>Pricing</h2>
          <div className="prices">
            <div className="price">
              <h3>Free</h3>
              <ul>
                <li>Unlimited reactions.</li>
                <li>One site.</li>
                <li>
                  <Image
                    src={logo}
                    width={20}
                    height={20}
                    alt="Web Reactionz logo"
                  />{" "}
                  branding.
                </li>
              </ul>
              <i className="pricingNote">
                No payment details required. No time limits.
              </i>
              <Button
                appearance="primary"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
              >
                Start now
              </Button>
            </div>
            <div className="price">
              <h3>£3/month (or £30 annually)</h3>
              <ul>
                <li>Unlimited reactions.</li>
                <li>Unlimited sites.</li>
                <li>Email support.</li>
                <li>
                  No{" "}
                  <Image
                    src={logo}
                    width={20}
                    height={20}
                    alt="Web Reactionz logo"
                  />{" "}
                  branding.
                </li>
              </ul>
              <Button appearance="primary" href="/api/auth/stripe/checkout">
                Start now
              </Button>
            </div>
          </div>
        </SlideInContainer>
      </main>
      <ReactionsWidget domSelector="#reactions-wrapper" />
    </>
  );
}
