import LegalPage from "../components/LegalPage";
import { site } from "../utils/seo";

export default function Terms() {
  return (
    <LegalPage
      title="Terms and Conditions"
      description="The terms that apply to your use of praveencloud.com."
      path="/terms-and-conditions"
      updated="28 September 2026"
    >
      <p>
        By using praveencloud.com you agree to the terms below. If you do not agree with
        them, please stop using the site.
      </p>

      <h2>Use of the content</h2>
      <p>
        The articles, diagrams and code samples on this site are published for learning
        and reference. You may read them, share links to them, and use the code samples
        in your own work. You may not republish whole articles as your own, whether on a
        website, in a newsletter or in training material, without permission.
      </p>

      <h2>Code samples</h2>
      <p>
        Commands, scripts and configuration in these articles are examples. They are
        written to illustrate a concept, not to be dropped into a production system
        unchanged. Read and understand anything before you run it, and test it somewhere
        safe first — particularly anything that deletes resources, changes permissions or
        touches live infrastructure.
      </p>

      <h2>Accuracy and availability</h2>
      <p>
        Cloud platforms and DevOps tooling change quickly. Content is written against the
        versions current at the time of publication and may become outdated. No guarantee
        is made that the site will be available uninterrupted or free of errors.
      </p>

      <h2>External links</h2>
      <p>
        This site links to third-party documentation and tools. Those destinations are
        not under my control, and linking to them is not an endorsement of their content,
        terms or privacy practices.
      </p>

      <h2>Advertising</h2>
      <p>
        This site may carry third-party advertising. Advertisements are served by the ad
        network and do not constitute a recommendation by me of the advertised product.
        See the <a href="/privacy-policy">privacy policy</a> for how advertising cookies
        are handled.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The content is provided “as is”, without warranty of any kind. I am not liable
        for any loss, data damage, downtime or cost arising from the use of anything
        published here. See the <a href="/disclaimer">disclaimer</a> for detail.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}
