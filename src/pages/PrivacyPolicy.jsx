import LegalPage from "../components/LegalPage";
import { site } from "../utils/seo";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How praveencloud.com handles your data, cookies and third-party advertising."
      path="/privacy-policy"
      updated="28 September 2026"
    >
      <p>
        This privacy policy explains what information praveencloud.com (“this site”)
        collects when you visit it, why it is collected and what is done with it. The
        site is a personal technical blog run by {site.name}.
      </p>

      <h2>Information collected directly</h2>
      <p>
        This site does not run accounts, logins or newsletters, and it does not ask you
        to submit personal information to read anything on it. If you contact me by
        email or LinkedIn using the details on the contact page, I receive whatever you
        choose to put in that message and use it only to reply to you.
      </p>

      <h2>Information collected automatically</h2>
      <p>
        Like most websites, the hosting provider records standard server log data —
        IP address, browser and operating system, the page requested and the time of the
        request. This is used to keep the site running and to understand which articles
        are read. It is not used to identify individual visitors.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        This site may display advertising supplied by Google AdSense. Third-party
        vendors, including Google, use cookies to serve ads based on your prior visits
        to this or other websites.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve
          ads to you based on your visit to this site and other sites on the internet.
        </li>
        <li>
          You can opt out of personalised advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can opt out of third-party vendors&apos; use of cookies for personalised
          advertising at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </li>
      </ul>
      <p>
        Most browsers also let you block or delete cookies in their settings. Blocking
        them does not stop you reading anything on this site.
      </p>

      <h2>Third-party links</h2>
      <p>
        Articles link to external documentation, tools and repositories. Those sites
        have their own privacy policies, and this policy does not cover them.
      </p>

      <h2>Children</h2>
      <p>
        This site publishes technical material for working engineers and is not directed
        at children under 13. No information is knowingly collected from them.
      </p>

      <h2>Your choices</h2>
      <p>
        If you would like to know what correspondence I hold from you, or would like it
        deleted, email me at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> and I will action it.
      </p>

      <h2>Changes</h2>
      <p>
        This policy may be updated as the site changes. The “last updated” date above
        always reflects the current version.
      </p>
    </LegalPage>
  );
}
