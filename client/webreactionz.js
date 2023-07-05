class WebReactionz {
  #DEFAULT_URL = "https://webreactionz.com";
  #CSS_URL =
    "https://cdn.jsdelivr.net/gh/intersect-software/web-reactionz@1/public/WebReactionz.min.css";

  #DEFAULT_WIDGET_SETTINGS = {
    layout: "horizontal",
    position: "top",
    showReactionCounts: true,
    theme: "minimal",
  };

  #NAME = "WebReactionz";
  #SITE_ID;
  #SKIP_FETCH_SETTINGS;
  #BASE_URL;
  #PAGE_ID;
  #WIDGET_SETTINGS;
  #VISIBLE_CLASS = "visible";

  constructor(options = {}) {
    const getOptionValue = (name) =>
      options[name] ?? options[name.toLowerCase()];

    this.#SITE_ID = getOptionValue("siteId");
    if (!this.#SITE_ID) {
      throw new Error(this.#errorString("No Site ID provided"));
    }

    this.#SKIP_FETCH_SETTINGS = getOptionValue("noAutoFetch");
    this.#BASE_URL = getOptionValue("baseUrl") ?? this.#DEFAULT_URL;

    this.#PAGE_ID =
      options.computePageId?.() ??
      getOptionValue("pageId") ??
      location.pathname
        .split("/")
        .findLast((p) => p !== "")
        ?.split(".")[0] ??
      "/";

    this.#WIDGET_SETTINGS = [
      "layout",
      "position",
      "prompt",
      "showReactionCounts",
      "domSelector",
      "bordered",
      "fontSizeScale",
      "fontColor",
      "theme",
    ].reduce((acc, cur) => {
      const value = getOptionValue(cur);
      if (typeof value !== "undefined") {
        acc[cur] = ["showReactionCounts", "bordered"].includes(cur)
          ? !!+value
          : value;
      }
      return acc;
    }, {});

    this.#injectCss(this.#CSS_URL);
  }

  async #fetchWidgetDetails(skipSettings = false) {
    return fetch(
      `${this.#BASE_URL}/api/sites/${this.#SITE_ID}/widgetDetails?page_id=${
        this.#PAGE_ID
      }&settings=${skipSettings ? "0" : "1"}`
    ).then((res) => res.json());
  }

  async init() {
    try {
      const widgetDetailsRes = await this.#fetchWidgetDetails(
        this.#SKIP_FETCH_SETTINGS
      );

      // Get dashboard settings, but override with any passed in settings
      this.#WIDGET_SETTINGS = {
        ...this.#DEFAULT_WIDGET_SETTINGS,
        ...(widgetDetailsRes.settings ?? {}),
        ...this.#WIDGET_SETTINGS,
      };

      const domSelector = this.#WIDGET_SETTINGS.domSelector;
      if (!domSelector) {
        throw new Error(this.#errorString("No DOM selector provided"));
      }

      const rootElement = document.querySelector(domSelector);
      if (!rootElement) {
        throw new Error(
          this.#errorString("No DOM element found for selector"),
          domSelector
        );
      }

      const { reactions, userHasReacted } = widgetDetailsRes;
      const reactionElements = Object.keys(reactions).map((emoji) =>
        this.#createReaction(
          emoji,
          reactions[emoji].count,
          reactions[emoji].unicode,
          userHasReacted
        )
      );

      const wrapper = this.#newEl("div", {
        classes: [
          this.#NAME,
          this.#WIDGET_SETTINGS.position,
          this.#WIDGET_SETTINGS.layout,
          this.#WIDGET_SETTINGS.theme,
          this.#WIDGET_SETTINGS.bordered ? "bordered" : "",
        ],
      });
      if (this.#WIDGET_SETTINGS.fontSizeScale) {
        wrapper.style.fontSize = `${this.#WIDGET_SETTINGS.fontSizeScale}em`;
      }
      if (this.#WIDGET_SETTINGS.fontColor) {
        wrapper.style.fontColor = this.#WIDGET_SETTINGS.fontColor;
      }

      if (this.#WIDGET_SETTINGS.prompt) {
        const prompt = this.#newEl("div", {
          classes: ["prompt"],
          innerText: this.#WIDGET_SETTINGS.prompt,
        });
        wrapper.append(prompt);
      }

      const emojisWrapper = this.#newEl("div", {
        classes: ["emojis", this.#WIDGET_SETTINGS.layout],
        children: reactionElements,
      });
      wrapper.append(emojisWrapper);

      if (widgetDetailsRes.branding) {
        wrapper.append(this.#createBrandingElement());
      }

      rootElement.insertAdjacentElement(
        this.#WIDGET_SETTINGS.position === "bottom"
          ? "beforeend"
          : "afterbegin",
        wrapper
      );

      if (["left", "right"].includes(this.#WIDGET_SETTINGS.position)) {
        const top =
          rootElement.getBoundingClientRect().top +
          document.documentElement.scrollTop;

        const handleResize = () =>
          this.#handleResize(rootElement, wrapper, top);
        handleResize();
        window.addEventListener("resize", handleResize);

        const handleScroll = () => this.#handleScroll(wrapper, top);
        handleScroll();
        window.addEventListener("scroll", handleScroll);
      } else {
        wrapper.classList.add(this.#VISIBLE_CLASS);
      }
    } catch (err) {
      console.error(this.#errorString("Failed to initialise"), err);
    }
  }

  #handleScroll(wrapper, top) {
    // If there is a vertical scrollbar on the page...
    if (document.body.scrollHeight > window.innerHeight) {
      // Then only show (fade-in) the reactions widget after a tiny scroll
      if (window.scrollY > 0) wrapper.classList.add(this.#VISIBLE_CLASS);
      else wrapper.classList.remove(this.#VISIBLE_CLASS);

      // Ideally, we would use position:sticky to keep it at the top of the element
      //  as you scroll. But position:sticky elements take up space. Even if we set
      //  a negative margin-top to compensate for the space (esp. with vertical emojis)
      //  it doesn't look as good.
      // So instead, use position:fixed and dynamically change the TOP position as you scroll
      if (window.scrollY > top) wrapper.style.top = 0;
      else wrapper.style.top = `${top - window.scrollY}px`;
      return;
    }

    // If no vertical scrollbar on page, then show reactions widget immediately
    wrapper.classList.add(this.#VISIBLE_CLASS);
  }

  #handleResize(rootElement, wrapper, top) {
    wrapper.style.top = `${top}px`;
    const width = wrapper.getBoundingClientRect().width;
    const bounding = rootElement.getBoundingClientRect();
    if (this.#WIDGET_SETTINGS.position === "left") {
      wrapper.style.left = `${bounding.left - width - 10}px`;
    } else {
      wrapper.style.left = `${bounding.right + width + 10}px`;
    }
  }

  #createReaction(
    reactionType,
    reactionCount,
    reactionUnicode,
    userHasReacted
  ) {
    const increment = this.#newEl("span", {
      classes: ["increment"],
      innerText: "+1",
    });

    const number = this.#newEl("span", {
      classes: ["number"],
      innerText:
        this.#WIDGET_SETTINGS.showReactionCounts && reactionCount
          ? reactionCount
          : "",
    });

    const wrapper = this.#newEl("span", {
      classes: ["reaction", userHasReacted && "disabled"],
      data: {
        type: reactionType,
        title: userHasReacted
          ? "You have already reacted on this page"
          : "React to this page?",
      },
      children: [
        this.#newEl("span", { classes: ["emoji"], innerText: reactionUnicode }),
        this.#newEl("span", {
          children: [number, increment],
        }),
      ],
    });

    const postBody = JSON.stringify({
      page_id: this.#PAGE_ID,
      type: reactionType,
    });

    wrapper.onclick = () => {
      increment.classList.remove("active");
      fetch(`${this.#BASE_URL}/api/sites/${this.#SITE_ID}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: postBody,
      })
        .then((res) => res.json())
        .then((res) => {
          if (!res.error) {
            increment.classList.add("active");
            if (this.#WIDGET_SETTINGS.showReactionCounts) {
              number.innerText =
                +(number.innerText.split("\n")[0]?.trim() ?? "0") + 1;
            }
          }
        });
    };

    return wrapper;
  }

  #createBrandingElement() {
    return this.#newEl("div", {
      title: `Powered by ${this.#NAME}`,
      children: [
        this.#newEl("a", {
          href: this.#DEFAULT_URL,
          target: "_blank",
          children: [
            this.#newEl("img", {
              src: `${this.#BASE_URL}/logo.svg`,
              classes: ["branding"],
            }),
          ],
        }),
      ],
    });
  }

  #newEl(elName, options = {}) {
    const { classes, dataset, children, ...fields } = options;
    const el = document.createElement(elName);

    Object.keys(fields).forEach((f) => (el[f] = fields[f]));
    children?.forEach((child) => el.appendChild(child));
    if (classes) el.classList.add(...classes.filter((c) => !!c));
    Object.keys(dataset ?? {}).forEach((d) => (el.dataset[d] = dataset[d]));

    return el;
  }

  #injectCss(url) {
    document
      .getElementsByTagName("head")[0]
      .insertAdjacentHTML(
        "beforeend",
        `<link rel="stylesheet" href="${url}"/>`
      );
  }

  #errorString(string) {
    return `${this.#NAME} ${string}`;
  }
}

const start = (options) => new WebReactionz(options).init();
if (!+document.currentScript.dataset.noautoinit) {
  const options = document.currentScript.dataset;
  if (document.readyState !== "loading") {
    start(options);
  } else {
    document.addEventListener("DOMContentLoaded", () => start(options));
  }
}
