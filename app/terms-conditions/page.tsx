import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us | MagicStocks.ai - Future of Stock Analysis",
  description:
    "Review the Terms and Conditions for using MagicStocks.ai. Understand your rights, responsibilities, and our commitment to providing a safe, AI-powered stock analysis experience.",
};

const TermsPage = () => {
  return (
    <section>
      <h1 className="text-6xl font-bold m-6 text-center">
        Terms and Conditions
      </h1>
      <div className="p-8 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Effective Date: 10 November 2024
          </p>

          <p className="mb-4">
            Welcome to <span className="font-semibold">magicstocks.ai</span>, a
            Software-as-a-Service (SaaS) platform that provides AI-driven stock
            market analysis by fetching real-time and historical stock market
            data. Please carefully read these Terms and Conditions before using
            our platform.
          </p>

          <p className="mb-4">
            By accessing or using{" "}
            <span className="font-semibold">magicstocks.ai</span>, you agree to
            be bound by these terms. If you do not agree to these terms, you
            must not access or use the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            1. Use of the Service
          </h2>
          <h3 className="font-semibold mt-4">1.1 Eligibility</h3>
          <p className="mb-4">
            You must be at least 18 years old or the age of majority in your
            jurisdiction to use this Service.
          </p>

          <h3 className="font-semibold mt-4">1.2 Account Registration</h3>
          <p className="mb-4">
            To access certain features of the Service, you must create an
            account and provide accurate and up-to-date information. You are
            responsible for maintaining the confidentiality of your account
            credentials.
          </p>

          <h3 className="font-semibold mt-4">1.3 License to Use</h3>
          <p className="mb-4">
            Upon registration and subscription, we grant you a non-exclusive,
            non-transferable license to access and use the Service solely for
            your personal or business stock market analysis purposes.
            Unauthorized use is strictly prohibited.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            2. AI and Stock Market Analysis
          </h2>
          <h3 className="font-semibold mt-4">2.1 Nature of AI Assistance</h3>
          <p className="mb-4">
            The Service uses Artificial Intelligence (AI) to analyze stock
            market trends based on real-time and historical data. While the AI
            model strives for accuracy, it is not infallible, and its
            predictions or analyses should not be treated as guaranteed
            financial advice.
          </p>

          <h3 className="font-semibold mt-4">
            2.2 Real-Time and Historical Data
          </h3>
          <p className="mb-4">
            The Service fetches real-time and historical stock market data from
            third-party APIs. While we strive to provide accurate and up-to-date
            information, we cannot guarantee the completeness, reliability, or
            accuracy of the data, as it is dependent on external sources.
          </p>

          <h3 className="font-semibold mt-4">2.3 No Investment Advice</h3>
          <p className="mb-4">
            The Service is for informational and educational purposes only.
            MagicStocks.ai does not provide financial, investment, tax, or legal
            advice. You are solely responsible for making your own investment
            decisions, and any reliance on the AI analysis is at your own risk.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            3. User Responsibilities
          </h2>
          <h3 className="font-semibold mt-4">3.1 Compliance with Laws</h3>
          <p className="mb-4">
            You agree to comply with all applicable local, state, national, and
            international laws and regulations when using the Service.
          </p>

          <h3 className="font-semibold mt-4">3.2 Prohibited Activities</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Use the Service for any unlawful purpose.</li>
            <li>
              Reverse engineer or attempt to extract the source code of the
              Service.
            </li>
            <li>
              Engage in any activity that could harm the Service, its
              infrastructure, or other users.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            4. Payment and Subscription
          </h2>
          <h3 className="font-semibold mt-4">4.1 Plans</h3>
          <p className="mb-4">
            The Service is available through various plans, which are outlined
            on our pricing page. You agree to pay all applicable fees as
            specified in your chosen plan.
          </p>

          <h3 className="font-semibold mt-4">4.2 Billing</h3>
          <p className="mb-4">
            Plan fees will be billed based on the plan chosen.
          </p>

          <h3 className="font-semibold mt-4">4.3 Cancellation and Refunds</h3>
          <p className="mb-4">
            We do not provide cancellation and refund. No refund will be
            provided on the unused credits.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            5. Intellectual Property
          </h2>
          <h3 className="font-semibold mt-4">5.1 Ownership</h3>
          <p className="mb-4">
            All content, features, and functionalities of the Service, including
            the AI algorithms, software, design, and data integrations, are the
            intellectual property of magicstocks.ai and its licensors.
          </p>

          <h3 className="font-semibold mt-4">5.2 Limited License</h3>
          <p className="mb-4">
            You are granted a limited, non-exclusive license to access and use
            the Service. You may not copy, modify, distribute, or create
            derivative works of the Service without our prior written consent.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            6. Third-Party Services and Data
          </h2>
          <h3 className="font-semibold mt-4">6.1 API Integrations</h3>
          <p className="mb-4">
            The Service integrates third-party APIs for stock market data. We
            are not responsible for the availability, accuracy, or reliability
            of data provided by third parties.
          </p>

          <h3 className="font-semibold mt-4">6.2 External Links</h3>
          <p className="mb-4">
            The Service may contain links to third-party websites or services.
            We are not responsible for the content, privacy policies, or
            practices of any third-party sites.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            7. Limitation of Liability
          </h2>
          <h3 className="font-semibold mt-4">7.1 No Guarantee of Results</h3>
          <p className="mb-4">
            magicstocks.ai makes no guarantees regarding the accuracy,
            completeness, or reliability of the stock market analysis or data
            provided by the Service. We are not liable for any financial losses
            or damages you may incur based on your use of the Service.
          </p>

          <h3 className="font-semibold mt-4">7.2 Liability Limitations</h3>
          <p className="mb-4">
            To the fullest extent permitted by law, magicstocks.ai and its
            affiliates, officers, and employees will not be liable for any
            indirect, incidental, special, or consequential damages arising out
            of your use of the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Termination</h2>
          <h3 className="font-semibold mt-4">8.1 Termination by You</h3>
          <p className="mb-4">
            You may terminate your account at any time by contacting us or
            discontinuing your use of the Service.
          </p>

          <h3 className="font-semibold mt-4">8.2 Termination by Us</h3>
          <p className="mb-4">
            We reserve the right to suspend or terminate your access to the
            Service at any time, without notice, for any violation of these
            Terms and Conditions.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            9. Changes to the Terms
          </h2>
          <p className="mb-4">
            We reserve the right to modify or update these Terms at any time.
            Any changes will be effective upon posting to the Service. Your
            continued use of the Service after any changes indicates your
            acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the
            laws of India, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            11. Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions or concerns regarding these Terms, you can
            contact us at:
          </p>

          <address className="mb-4">
            <p>magicstocks.ai</p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@magicstocks.ai"
                className="text-blue-600 dark:text-blue-400"
              >
                support@magicstocks.ai
              </a>
            </p>
          </address>

          <p className="text-sm italic">
            By using the Service, you acknowledge that you have read,
            understood, and agreed to these Terms and Conditions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsPage;
