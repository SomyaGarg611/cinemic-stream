import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-dark-lighter rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using Cinemic, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                Cinemic is a web-based platform that provides information about movies and TV shows. We aggregate data from 
                public APIs and external sources to provide users with comprehensive entertainment information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• You must be at least 13 years old to use this service</li>
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You agree not to use the service for any unlawful purposes</li>
                <li>• You will not attempt to gain unauthorized access to the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Content and Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All movie and TV show information is sourced from public APIs and databases. We do not claim ownership 
                of any movie or TV show content, images, or related intellectual property. All rights belong to their 
                respective owners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Streaming and External Links</h2>
              <p className="text-gray-300 mb-4">
                Our platform may provide links to external streaming services. We do not host, control, or endorse 
                content on these external sites. Use of external streaming services is at your own risk and subject 
                to their respective terms of service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                Cinemic is provided "as is" without warranties of any kind. We shall not be liable for any damages 
                arising from the use of this service, including but not limited to direct, indirect, incidental, 
                punitive, and consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of 
                the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Modifications to Terms</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                posting to the website. Your continued use of the service constitutes acceptance of any modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;