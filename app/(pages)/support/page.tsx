"use client";
import Link from "next/link";
import { Message, Panel, PanelGroup } from "rsuite";

export default function Docs() {
  return (
    <main className="docs">
      <h2>Support & Docs</h2>
      <Message type="info">
        Details on how to set up, configure, and use Web Reactionz are below.
        Please feel free to contact us if you have any questions, and we will be
        more than happy to help!
      </Message>
      <PanelGroup accordion bordered>
        <Panel header={<h5>Setting up</h5>} bordered defaultExpanded>
          <p>To set up Web Reactionz on your site:</p>
          <ol>
            <li>
              Create a new site in your <Link href="/dashboard">dashboard</Link>
            </li>
            <li>
              Configure your site&apos;s settings in the dashboard (see below)
            </li>
            <li>
              Copy the HTML <code>&lt;script&gt;</code> tag provided and paste
              it into your webpage(s) just before the <code>&lt;/body&gt;</code>{" "}
              tag
            </li>
          </ol>
        </Panel>

        <Panel header={<h5>Configuring</h5>} bordered>
          <p>
            In your <Link href="/dashboard">dashboard</Link> you can edit your
            sites&apos; settings, such as:
          </p>
          <ul>
            <li>Which emojis to show as reaction options</li>
            <li>How many times someone can react to a page</li>
            <li>What text to show to the user</li>
            <li>
              How the reaction widget should look like (bordered,
              vertical/horizontal, etc.)
            </li>
          </ul>
          <p>
            Note: you must find the DOM Selector for the element on your page(s)
            that you want the reactions to be added to. For example, if you are
            adding Web Reactionz to a blog, you will need the DOM selector of
            your main blog content. Then, your reactions will automatically be
            added to e.g., the top of your blog content.
          </p>
          <p>
            To find the DOM selector, right click on your page content in your
            web browser, and choose &apos;Inspect Element&apos;. A new tool will
            open that shows the elements of your webpage. Hover over the
            selected element, or parent elements above it, to find the first
            element that causes your entire content to be highlighted. Then,
            right click on the element, click &apos;Copy&apos; and &apos;Copy
            selector&apos;. Paste this into your{" "}
            <Link href="/dashboard">dashboard.</Link>
          </p>
        </Panel>

        <Panel header={<h5>Statistics</h5>} bordered>
          <p>
            Your <Link href="/dashboard">dashboard</Link> shows the total number
            of each reaction received for each of your sites and their pages.
          </p>
          <p>
            Clicking on a page will show graphs showing how the number of
            reactions has changed over time, or let you look at a specific day
            to see the breakdown of reactions.
          </p>
        </Panel>

        <Panel header={<h5>Advanced usage (via JavaScript)</h5>} bordered>
          <Message type="info">
            Note: this section is intended for developers or designers who want
            to use JavaScript to customise their reaction buttons further. If
            you would like to do this but are not sure how to, please get in
            touch and we will gladly help!
          </Message>
          <p>
            The Web Reactionz script exposes the <code>WebReactionz</code>{" "}
            JavaScript class to the page to enable further customisation (or,
            per-page overrides). By default, this is automatically constructed
            and initialised when you include the script on your page. By
            default, the settings defined in your dashboard are also
            automatically fetched to render the widget as you configured.
          </p>
          <p>
            You can change these behaviours by setting the following attributes
            on the script tag when including it:
          </p>
          <ul>
            <li>
              <code>data-noautoinit=&apos;1&apos;</code>, to disable
              auto-initialisation. This is <strong>required</strong> if you wish
              to use JavaScript to configure your settings.
            </li>
            <li>
              <code>data-noautofetch=&apos;1&apos;</code>, to disable
              auto-fetching of the configuration. This is useful if you intend
              to specify all of the configuration options in code, so can reduce
              the size of the network response.
            </li>
          </ul>
          <p>
            If you disable auto-initialisation, you must manually initialise it
            in JavaScript with the following options:
          </p>
          <pre>
            {`new WebReactionz({
  // Your Site ID, found in your dashboard
  siteId?: string,
  // The CSS selector of the DOM element where the widget should be added
  domSelector?: string,
  // Whether to auto-fetch your site's dashboard configuration options on page-load
  noAutoFetch?: number | boolean,
  // The base URL of the server hosting the script (defaults to 'https://WebReactionz.com')
  baseUrl?: string,
  // The ID to give the page (defaults to the full path of the URL); can provide a function returning the ID
  pageId?: string | () => string,

  // Widget options, as found in your dashboard:
  layout?: 'horizontal' | 'vertical', // defaults to 'horizontal'
  position?: 'top' | 'bottom' | 'left' | 'right', // defaults to 'top'
  prompt?: string, // defaults to ''
  showReactionCounts?: boolean, // defaults to true -- but has no effect if disabled in the dashboard
  bordered?: boolean,
  fontSizeScale?: number,
  fontColor?: string,
  theme?: 'minimal' | 'multiline',
}).init()`}
          </pre>
          <p>
            If you do not wish to use JavaScript to configure the above options,
            all are also passable as <code>data-*</code> attributes on the{" "}
            <code>script</code> tag by converting the field name to lowercase,
            without underscores (e.g., <code>noAutoFetch</code> becomes the{" "}
            <code>data-noautofetch</code> attribute). However, this has
            limitations such as not being able to provide a custom function to
            compute the <code>pageId</code>.
          </p>
          <p>
            <strong>
              Note that all fields are optional, however at a minimum{" "}
              <code>siteId</code> and <code>domSelector</code> must be provided
              as either a <code>data-*</code> attribute or as a JS option.
            </strong>
          </p>
          <p>
            You can configure options via the dashboard, <code>data-*</code>{" "}
            attributes, JS, or a mixture of all three. The order of precedence
            for configuration options is as follows: JS &gt; data attribute &gt;
            dashboard configuration.
          </p>
        </Panel>

        <Panel header={<h5>Advanced styling (via CSS)</h5>} bordered>
          <Message type="info">
            Note: this section is intended for developers or designers who want
            to use CSS to customise the look of their reaction buttons further.
            If you would like to do this but are not sure how to, please get in
            touch and we will gladly help!
          </Message>
          <p>
            The Web Reactionz script imports a CSS file for all styling. If you
            wish to change the look of any element of the widget, please
            override the CSS styles as desired.
          </p>
          <p>
            It is usually easiest to inspect the styles within your web browser
            and tweak them as required, however a summary of the CSS classes
            used is below:
          </p>
          <ul>
            <li>
              <code>.webReactionz</code> &mdash; parent wrapper
            </li>
            <li>
              <code>.webReactionz .increment</code> &mdash; &apos;+1&apos;
              wrapper (used in combination with <code>.active</code> to only
              show on click)
            </li>
            <li>
              <code>.webReactionz .emojis</code> &mdash; emojis wrapper
            </li>
            <li>
              <code>.webReactionz .reaction</code> &mdash; emoji + increment
              wrapper
            </li>
            <li>
              <code>.webReactionz .emoji</code> &mdash; an emoji
            </li>
            <li>
              <code>.left,.right,.top,.bottom,.vertical,.horizontal</code>{" "}
              &mdash; as per the configuration options
            </li>
          </ul>
        </Panel>
      </PanelGroup>
    </main>
  );
}
