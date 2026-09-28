import LegalPage from "../components/LegalPage";
import { site } from "../utils/seo";

export default function Disclaimer() {
  return (
    <LegalPage
      title="Disclaimer"
      description="Technical content on praveencloud.com is provided for educational purposes."
      path="/disclaimer"
      updated="28 September 2026"
    >
      <p>
        Everything published on praveencloud.com is written for educational and
        informational purposes. It reflects my own experience as a cloud and DevOps
        engineer and is not professional advice for your specific environment.
      </p>

      <h2>Run nothing blindly</h2>
      <p>
        Articles contain shell commands, Dockerfiles, Kubernetes manifests, Terraform
        configuration and CI/CD pipelines. These are teaching examples. Before you run
        any of them:
      </p>
      <ul>
        <li>Read the command and be sure you know what it does.</li>
        <li>Try it in a test account, namespace or virtual machine first.</li>
        <li>Check anything that deletes, overwrites or changes access before applying it.</li>
        <li>Be aware that cloud resources you create may incur charges on your account.</li>
      </ul>
      <p>
        I accept no responsibility for data loss, outages, security incidents or cloud
        bills resulting from following anything on this site.
      </p>

      <h2>No affiliation</h2>
      <p>
        AWS, Microsoft Azure, Google Cloud, Docker, Kubernetes, HashiCorp Terraform, Red
        Hat Ansible, Jenkins and GitHub are trademarks of their respective owners. This
        site is independent and is not affiliated with, endorsed by or sponsored by any
        of them. Product names are used only to identify the technology being described.
      </p>

      <h2>Views are my own</h2>
      <p>
        Opinions expressed here are mine alone and do not represent the views of any
        current or former employer or client.
      </p>

      <h2>Accuracy over time</h2>
      <p>
        Cloud services change frequently. An article that was correct when published may
        not match the current console, CLI or API. Always check the vendor&apos;s official
        documentation for the authoritative answer.
      </p>

      <h2>External content</h2>
      <p>
        Links to third-party sites are provided for convenience. I do not control their
        content and am not responsible for it.
      </p>

      <h2>Get in touch</h2>
      <p>
        Spotted something wrong or out of date? Please tell me at{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> so I can correct it.
      </p>
    </LegalPage>
  );
}
