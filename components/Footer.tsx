import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="links">
        <div>&copy; 2023 Intersect Software Ltd.</div>
        <div>
          <span>
            <Link href="/privacy">Privacy</Link> /{" "}
            <Link href="/terms">Terms</Link>
          </span>
          <span>
            <Link href="mailto:support@webreactionz.com">Contact</Link>
          </span>
        </div>
        <div>
          <span>
            <Link href="/blog">Blog</Link> /{" "}
            <Link href="/support">Support</Link>
          </span>
          <span>
            <a href="https://github.com/intersect-software/web-reactionz">
              GitHub
            </a>
          </span>
        </div>
      </div>
      <div className="companyDetails">
        Registered in England &amp; Wales. Company No. 14955283. Registered
        office address: 82A, James Carter Road, Mildenhall, Suffolk, IP28 7DE,
        United Kingdom.
      </div>
    </footer>
  );
}
