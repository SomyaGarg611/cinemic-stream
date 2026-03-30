import React from 'react';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-lighter to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-dark-lighter rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-8">Disclaimer</h1>
          <p className="text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">General Information</h2>
              <p className="text-gray-300 mb-4">
                Cinemic is an entertainment information platform that provides data about movies and TV shows. 
                The information on this website is for general informational purposes only and should not be 
                considered as professional advice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Content Accuracy</h2>
              <p className="text-gray-300 mb-4">
                While we strive to provide accurate and up-to-date information about movies and TV shows, we 
                make no representations or warranties of any kind, express or implied, about the completeness, 
                accuracy, reliability, or availability of the information on our platform.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Information is sourced from third-party APIs and databases</li>
                <li>• Release dates, ratings, and descriptions may change without notice</li>
                <li>• We are not responsible for outdated or incorrect information</li>
                <li>• Users should verify information with official sources when necessary</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">External Links and Streaming Services</h2>
              <p className="text-gray-300 mb-4">
                Our platform may contain links to external websites and streaming services. These links are 
                provided for convenience and informational purposes only.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• We do not endorse, control, or monitor external websites</li>
                <li>• We are not responsible for the content, privacy policies, or practices of external sites</li>
                <li>• Streaming availability may vary by region and change without notice</li>
                <li>• Use of external streaming services is at your own risk and subject to their terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Copyright and Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                All movie and TV show content, including but not limited to posters, images, trailers, and 
                descriptions, are the property of their respective copyright holders.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• We do not claim ownership of any copyrighted material</li>
                <li>• All trademarks and logos belong to their respective owners</li>
                <li>• Content is used for informational and educational purposes under fair use</li>
                <li>• We respect intellectual property rights and will remove content upon valid request</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p className="text-gray-300 mb-4">
                We make no guarantees about the continuous availability, reliability, or performance of our service.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• The service may be temporarily unavailable due to maintenance or technical issues</li>
                <li>• We may modify, suspend, or discontinue features without prior notice</li>
                <li>• Third-party API limitations may affect data availability</li>
                <li>• We are not liable for service interruptions or data loss</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Age Ratings and Content Warnings</h2>
              <p className="text-gray-300 mb-4">
                Movie and TV show ratings are provided by external sources and may not reflect current or 
                accurate content warnings.
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Age ratings may vary by country and rating system</li>
                <li>• We recommend verifying content appropriateness independently</li>
                <li>• Parents and guardians should review content before allowing minors to view</li>
                <li>• Content warnings and descriptions may not be comprehensive</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                In no event shall Cinemic, its operators, or contributors be liable for any direct, indirect, 
                incidental, special, consequential, or punitive damages arising from:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6 mb-4">
                <li>• Use or inability to use our service</li>
                <li>• Reliance on information provided on our platform</li>
                <li>• Access to or use of external websites and services</li>
                <li>• Service interruptions, errors, or omissions</li>
                <li>• Loss of data or content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Disclaimer</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to modify this disclaimer at any time without prior notice. Changes will 
                be effective immediately upon posting. Continued use of our service constitutes acceptance of 
                any modifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this disclaimer or notice any copyright infringement, please 
                contact us immediately through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;