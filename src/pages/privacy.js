export function createPrivacyPolicy() {
  return `
    <section class="legal-page">
      <div class="legal-container">
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-date">Effective Date: April 15, 2026</p>

        <div class="legal-content">
          <h2>1. Introduction</h2>
          <p>Welcome to <strong>Design Hub Pro</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image processing services, including batch renaming and background removal tools (collectively, the "Services").</p>
          <p>By accessing or using our Services, you agree to the terms of this Privacy Policy. If you do not agree with the practices described herein, please do not use our Services.</p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide Directly</h3>
          <ul>
            <li><strong>Account Registration Information</strong>: When you sign up using Clerk authentication, we collect your email address and basic profile information.</li>
            <li><strong>Payment Information</strong>: Payment processing is handled entirely by <strong>Creem</strong> (our Merchant of Record). We do not collect, store, or process any credit card or payment card information directly.</li>
            <li><strong>User-Generated Content</strong>: Images you upload for processing through our Services.</li>
          </ul>
          
          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data</strong>: Technical data including your IP address, browser type, operating system, access times, and pages visited.</li>
            <li><strong>Cookies and Tracking Technologies</strong>: We use essential cookies to maintain session state and improve service functionality.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information for the following purposes:</p>
          <div class="legal-table">
            <div class="table-row header">
              <span>Purpose</span>
              <span>Legal Basis</span>
            </div>
            <div class="table-row">
              <span>To provide and maintain our Services</span>
              <span>Contractual necessity</span>
            </div>
            <div class="table-row">
              <span>To process your images as requested</span>
              <span>Consent (explicit)</span>
            </div>
            <div class="table-row">
              <span>To manage your account and provide customer support</span>
              <span>Contractual necessity</span>
            </div>
            <div class="table-row">
              <span>To process payments via Creem</span>
              <span>Contractual necessity</span>
            </div>
            <div class="table-row">
              <span>To send service-related notifications</span>
              <span>Legitimate interests</span>
            </div>
            <div class="table-row">
              <span>To improve and optimize our Services</span>
              <span>Legitimate interests</span>
            </div>
          </div>

          <h2>4. Image Processing and Data Retention</h2>
          
          <h3>4.1 User Uploaded Images</h3>
          <ul>
            <li><strong>Purpose Limitation</strong>: Images you upload to our Services are used solely for the requested processing operations (AI batch renaming, background removal, and other image processing tasks).</li>
            <li><strong>No AI Training</strong>: We guarantee that your uploaded images will <strong>never</strong> be used to train, improve, or develop any artificial intelligence, machine learning, or neural network models.</li>
            <li><strong>Automatic Deletion</strong>: All uploaded images are automatically deleted from our servers within <strong>30 days</strong> after processing completion, unless you request earlier deletion.</li>
            <li><strong>No Sharing with Third Parties</strong>: Your images are never shared, sold, or transferred to any third parties for any purpose.</li>
          </ul>
          
          <h3>4.2 Data Retention</h3>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>

          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your information, including:</p>
          <ul>
            <li><strong>Encryption</strong>: All data transmitted between your browser and our servers is encrypted using TLS/SSL protocol.</li>
            <li><strong>Access Controls</strong>: Strict access controls limit the number of employees who can access user data, and such access is granted only on a need-to-know basis.</li>
            <li><strong>Regular Security Audits</strong>: We conduct periodic security reviews to identify and address potential vulnerabilities.</li>
            <li><strong>Secure Infrastructure</strong>: Our servers are hosted in secure, controlled environments with physical and network security protections.</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to maintaining appropriate measures to protect your data.</p>

          <h2>6. Third-Party Services</h2>
          
          <h3>6.1 Clerk (Authentication)</h3>
          <p>We use <strong>Clerk</strong> as our third-party authentication provider. Clerk handles the collection and storage of your sign-in credentials and basic profile information. Please review Clerk's Privacy Policy at: <a href="https://clerk.com/privacy" target="_blank" rel="noopener">https://clerk.com/privacy</a></p>
          
          <h3>6.2 Creem (Payment Processing)</h3>
          <p>Payments are processed by <strong>Creem</strong> as our Merchant of Record. Creem handles all payment collection, tax compliance, and PCI-DSS compliance. We do not store any payment card information on our servers. Please review Creem's Privacy Policy at: <a href="https://creem.io/privacy" target="_blank" rel="noopener">https://creem.io/privacy</a></p>
          
          <h3>6.3 Zhipu AI (Image Processing)</h3>
          <p>We utilize <strong>Zhipu AI</strong>'s API services to perform image analysis and processing tasks. This means your uploaded images are temporarily processed through Zhipu AI's servers to provide the requested Services. Zhipu AI processes this data only as our data processor and is contractually bound not to use your images for any other purpose.</p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <div class="legal-table">
            <div class="table-row header">
              <span>Right</span>
              <span>Description</span>
            </div>
            <div class="table-row">
              <span>Access</span>
              <span>Request a copy of the personal information we hold about you</span>
            </div>
            <div class="table-row">
              <span>Rectification</span>
              <span>Request correction of inaccurate personal information</span>
            </div>
            <div class="table-row">
              <span>Erasure</span>
              <span>Request deletion of your personal information (subject to legal retention requirements)</span>
            </div>
            <div class="table-row">
              <span>Portability</span>
              <span>Request transfer of your data in a structured, commonly used format</span>
            </div>
            <div class="table-row">
              <span>Objection</span>
              <span>Object to certain processing activities based on legitimate interests</span>
            </div>
            <div class="table-row">
              <span>Withdraw Consent</span>
              <span>Withdraw previously given consent at any time</span>
            </div>
          </div>
          
          <h3>7.1 How to Exercise Your Rights</h3>
          <p>To exercise any of these rights, please contact us at:</p>
          <p><strong>Email</strong>: <a href="mailto:whvsjp1998@gmail.com">whvsjp1998@gmail.com</a></p>
          <p>We will respond to your request within <strong>30 days</strong>. For data deletion requests, please note that we may retain certain information for legal, tax, or regulatory compliance purposes.</p>

          <h2>8. Children's Privacy</h2>
          <p>Our Services are not intended for individuals under the age of <strong>16</strong>. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal data from a child under 16, we will take steps to delete such information promptly.</p>

          <h2>9. International Data Transfers</h2>
          <p>If you are located outside of the People's Republic of China, please note that your information may be transferred to and processed in jurisdictions where we or our third-party service providers operate. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.</p>

          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. We will notify you of any material changes by:</p>
          <ul>
            <li>Posting the updated Privacy Policy on this page</li>
            <li>Updating the "Effective Date" at the top of this policy</li>
            <li>Providing prominent notice through our Services</li>
          </ul>
          <p>Your continued use of our Services after any modifications indicates your acceptance of the updated Privacy Policy.</p>

          <h2>11. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <p><strong>Email</strong>: <a href="mailto:whvsjp1998@gmail.com">whvsjp1998@gmail.com</a></p>
          <p>We are committed to resolving any privacy-related issues promptly and professionally.</p>
        </div>

        <p class="legal-footer">Last updated: April 15, 2026</p>
      </div>
    </section>
  `;
}

export function initPrivacyPolicy() {
}