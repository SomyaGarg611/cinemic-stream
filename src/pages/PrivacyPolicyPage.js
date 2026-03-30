import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-dark-lighter rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                Cinemic is designed with privacy in mind. We collect minimal information to provide our services:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• <strong>Usage Data:</strong> Pages visited, features used, and interaction patterns</li>
                <li>• <strong>Device Information:</strong> Browser type, operating system, and device identifiers</li>
                <li>• <strong>Search Queries:</strong> Movie and TV show searches to improve our service</li>
                <li>• <strong>Preferences:</strong> Settings and customizations you make</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">We use collected information to:</p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Provide and maintain our movie and TV show information service</li>
                <li>• Improve user experience and platform functionality</li>
                <li>• Analyze usage patterns to enhance our features</li>
                <li>• Ensure platform security and prevent abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties. However, 
                we may share information in the following circumstances:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• With service providers who assist in operating our platform</li>
                <li>• When required by law or to protect our legal rights</li>
                <li>• To prevent fraud or security threats</li>
                <li>• In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
              <p className="text-gray-300 mb-4">
                Our platform integrates with external services and APIs:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• <strong>TMDB API:</strong> For movie and TV show information</li>
                <li>• <strong>Streaming Services:</strong> External platforms for content viewing</li>
                <li>• <strong>Analytics Services:</strong> To understand user behavior and improve our service</li>
              </ul>
              <p className="text-gray-300 mb-4">
                These third-party services have their own privacy policies. We encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookies and Local Storage</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and local storage to enhance your experience:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Save your preferences and settings</li>
                <li>• Remember your viewing history and favorites</li>
                <li>• Analyze platform usage and performance</li>
                <li>• Provide personalized content recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Secure data transmission using HTTPS encryption</li>
                <li>• Regular security assessments and updates</li>
                <li>• Limited access to personal information</li>
                <li>• Industry-standard security practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Access and review the information we have about you</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt out of certain data collection practices</li>
                <li>• Disable cookies through your browser settings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If we become aware that a child under 13 has 
                provided us with personal information, we will delete such information immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify users of any material 
                changes by posting the new Privacy Policy on this page and updating the "last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact 
                us through our contact page or email us at gargsomya611@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;