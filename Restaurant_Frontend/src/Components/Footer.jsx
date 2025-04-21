import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Footer() {
  // State to control our own modal/popup
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  // Custom popup implementation instead of using toast
  const showCustomModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const showAboutUs = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "About Us",
      <div>
        <p className="text-sm">
          Quickbites was founded in 2025 with a simple yet bold mission: to
          deliver fast, delicious meals straight to your door, crafted with care
          by our own culinary team. We’re not just another delivery
          service—we’re your personal kitchen away from home.
        </p>
        <p className="text-sm mt-2">
          Our passionate team of food enthusiasts is dedicated to creating every
          dish with the freshest ingredients, ensuring that each meal arrives
          hot, flavorful, and exactly as you envisioned. From hearty comfort
          classics to innovative culinary creations, we offer a curated menu
          designed to satisfy every craving.
        </p>
        <p className="text-sm mt-2">
          With our seamless app experience and efficient delivery network, we’re
          committed to making your mealtime effortless and enjoyable. Whether
          it’s a quick lunch, a cozy dinner, or a special treat, Quickbites is
          here to bring quality and convenience right to you—no restaurant
          hopping required.
        </p>
        <p className="text-sm mt-2">
          At Quickbites, we believe food is more than just fuel—it’s an
          experience. That’s why we pour our heart into every recipe, perfecting
          flavors and presentation so you can savor every bite. Join us on this
          delicious journey, and let us redefine what fast food can be.
        </p>
      </div>
    );
  };

  const showContact = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Contact Us",
      <div>
        <p className="text-sm">
          We're always here to help! Reach out to our customer support team
          through any of these channels:
        </p>
        <h4 className="font-semibold mt-2">Customer Support</h4>
        <p className="text-sm">Email: support@quickbites.com</p>
        <p className="text-sm">Phone: +1 (555) 123-4567</p>
        <p className="text-sm">Hours: 24/7</p>

        <h4 className="font-semibold mt-2">Business Inquiries</h4>
        <p className="text-sm">Email: partners@quickbites.com</p>
        <p className="text-sm">Phone: +1 (555) 987-6543</p>

        <h4 className="font-semibold mt-2">Headquarters</h4>
        <p className="text-sm">123 Flavor Street, Food City, FC 12345</p>
      </div>
    );
  };

  const showPrivacyPolicy = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Privacy Policy",
      <div>
        <p className="text-sm">
          At Quickbites, we value your privacy. This Privacy Policy outlines how
          we collect, use, and protect your personal information when you use
          our services.
        </p>

        <h4 className="font-semibold mt-2">1. Information We Collect</h4>
        <p className="text-sm">
          We may collect personal data such as your name, email address, phone
          number, delivery address, and payment details when you place an order,
          create an account, or subscribe to our newsletter. Additionally, we
          may collect non-personal data such as browser type, IP address, and
          device information to improve our services.
        </p>

        <h4 className="font-semibold mt-2">2. How We Use Your Information</h4>
        <p className="text-sm">
          Your data is used to:
          <ul className="list-disc ml-4">
            <li>Process and fulfill your orders</li>
            <li>Improve our services and user experience</li>
            <li>
              Send promotional offers, updates, and important notifications
            </li>
            <li>Ensure security and prevent fraudulent transactions</li>
          </ul>
          We do not sell or share your personal information with third parties
          for marketing purposes.
        </p>

        <h4 className="font-semibold mt-2">3. Data Protection</h4>
        <p className="text-sm">
          We implement security measures to protect your data, including
          encryption, secure servers, and access controls. However, while we
          strive to protect your information, we cannot guarantee absolute
          security in online transactions.
        </p>

        <h4 className="font-semibold mt-2">
          4. Cookies and Tracking Technologies
        </h4>
        <p className="text-sm">
          We use cookies and similar tracking technologies to enhance your
          browsing experience, analyze site traffic, and improve our services.
          You can manage your cookie preferences through your browser settings.
        </p>

        <h4 className="font-semibold mt-2">5. Third-Party Services</h4>
        <p className="text-sm">
          We may use third-party services (such as payment gateways and
          analytics tools) that collect and process data on our behalf. These
          services have their own privacy policies, and we recommend reviewing
          them for more information.
        </p>

        <h4 className="font-semibold mt-2">6. Your Rights</h4>
        <p className="text-sm">
          You have the right to access, update, or delete your personal
          information. You may also opt out of promotional communications at any
          time. For any privacy-related inquiries, contact us at{" "}
          <a href="mailto:support@quickbites.com" className="text-blue-500">
            support@quickbites.com
          </a>
          .
        </p>

        <h4 className="font-semibold mt-2">7. Changes to This Policy</h4>
        <p className="text-sm">
          We may update this Privacy Policy from time to time. Any significant
          changes will be communicated through our website or via email. Your
          continued use of our services constitutes acceptance of the updated
          policy.
        </p>
      </div>
    );
  };

  const showTermsOfService = (e) => {
    if (e) e.preventDefault();
    showCustomModal(
      "Terms of Service",
      <div>
        <p className="text-sm">
          By using the Quickbites platform, you agree to the following terms and
          conditions:
        </p>

        <h4 className="font-semibold mt-2">1. Account Registration</h4>
        <p className="text-sm">
          Users must provide accurate and complete information when creating an
          account. You are responsible for maintaining the confidentiality of
          your login credentials and for all activities that occur under your
          account. Quickbites is not liable for any unauthorized access due to
          compromised credentials.
        </p>

        <h4 className="font-semibold mt-2">2. Ordering and Payments</h4>
        <p className="text-sm">
          All payments are processed securely through our payment partners. By
          placing an order, you agree to pay the full amount displayed at
          checkout, including food costs, delivery fees, and applicable taxes.
          Quickbites reserves the right to cancel any order due to payment
          issues or fraudulent activity.
        </p>

        <h4 className="font-semibold mt-2">3. Delivery Guidelines</h4>
        <p className="text-sm">
          Delivery times are estimated and may vary based on factors such as
          order volume, traffic conditions, or weather. While we strive to
          deliver orders promptly, Quickbites is not responsible for delays
          beyond our control. Customers are required to provide accurate
          delivery addresses to avoid any issues.
        </p>

        <h4 className="font-semibold mt-2">4. Refunds and Cancellations</h4>
        <p className="text-sm">
          Orders may be canceled before preparation begins. Refund eligibility
          depends on the order’s status. If you receive an incorrect or
          unsatisfactory order, please contact Quickbites support within a
          reasonable timeframe for assistance.
        </p>

        <h4 className="font-semibold mt-2">5. User Responsibilities</h4>
        <p className="text-sm">
          Users agree to use the platform responsibly and must provide accurate
          information for deliveries. Any fraudulent activity, misuse, or
          violation of these terms may result in account suspension or
          termination.
        </p>

        <h4 className="font-semibold mt-2">6. Prohibited Activities</h4>
        <p className="text-sm">
          Users must not:
          <ul className="list-disc ml-4">
            <li>Use false information to place orders</li>
            <li>Disrupt or interfere with the platform’s operation</li>
            <li>Engage in fraudulent chargebacks or payment disputes</li>
            <li>Abuse customer support or violate community guidelines</li>
          </ul>
        </p>

        <h4 className="font-semibold mt-2">7. Changes to These Terms</h4>
        <p className="text-sm">
          Quickbites reserves the right to update these terms at any time.
          Continued use of the platform after changes take effect constitutes
          agreement to the revised terms.
        </p>

        <p className="text-sm mt-2">
          If you have any questions, please contact us at{" "}
          <a href="mailto:support@quickbites.com" className="text-blue-500">
            support@quickbites.com
          </a>
          .
        </p>
      </div>
    );
  };

  return (
    <div>
      <footer className="bg-orange-400 p-8 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 justify-between ">
          {/* Logo and Branding */}
          <div>
            <a href="#" className="flex items-center mb-4">
              <svg
                className="fill-current h-11 w-11 text-white mr-2"
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="300.000000pt"
                height="300.000000pt"
                viewBox="0 0 300.000000 300.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
                  fill="#FFFFFF"
                  stroke="none"
                >
                  <path d="M1435 2498 c-113 -22 -279 -107 -361 -186 -12 -12 -25 -18 -28 -15 -3 4 -6 2 -6 -4 0 -5 -18 -29 -40 -53 -22 -24 -40 -47 -40 -52 0 -4 -13 -27 -30 -50 -16 -22 -30 -44 -30 -48 0 -4 -10 -29 -22 -56 -26 -59 -25 -55 -38 -124 -28 -145 -19 -263 30 -418 17 -51 30 -102 29 -115 0 -12 -14 -42 -29 -67 -16 -25 -36 -58 -43 -75 -8 -16 -26 -48 -41 -69 -31 -47 -33 -84 -5 -120 26 -33 67 -34 100 -3 23 20 80 111 123 196 10 20 55 92 100 161 46 69 85 133 89 143 3 9 11 17 17 17 13 0 13 -6 -2 -33 -7 -12 -13 -26 -14 -32 -1 -5 -16 -37 -33 -70 -17 -33 -36 -72 -43 -87 -7 -16 -16 -28 -20 -28 -4 0 -8 -7 -8 -15 0 -17 -60 -130 -102 -192 -15 -23 -28 -46 -28 -51 0 -5 -16 -30 -35 -55 -19 -25 -35 -50 -35 -55 0 -20 -47 -92 -55 -85 -4 5 -5 3 -1 -4 6 -11 -15 -56 -34 -73 -3 -3 -17 -27 -31 -55 -14 -27 -43 -81 -63 -118 -41 -75 -41 -94 2 -134 30 -28 55 -23 90 16 29 32 91 127 102 155 4 12 31 58 59 103 28 46 51 90 51 98 0 9 4 14 9 11 5 -4 12 7 16 24 4 16 10 30 14 30 4 0 28 38 54 84 50 89 77 109 117 84 36 -23 35 -48 -6 -128 -22 -41 -42 -77 -45 -80 -3 -3 -21 -32 -39 -65 -18 -33 -39 -68 -48 -77 -8 -10 -13 -18 -10 -18 4 0 -14 -35 -38 -77 -24 -43 -44 -85 -44 -94 0 -29 33 -59 71 -65 48 -8 62 9 185 227 6 10 14 16 18 11 5 -4 7 0 5 8 -3 20 11 53 28 63 7 4 13 14 13 22 0 14 38 85 51 95 3 3 23 37 44 75 20 39 50 86 66 106 16 20 29 40 29 44 0 5 11 23 25 41 14 18 25 35 25 39 0 7 39 63 58 83 6 7 12 24 12 38 0 13 4 24 8 24 9 0 8 106 -1 189 -3 34 1 55 20 90 31 60 63 81 63 43 0 -29 35 -55 65 -50 21 4 31 -2 53 -33 28 -40 57 -49 81 -26 11 10 12 6 6 -23 -4 -19 -12 -41 -17 -47 -6 -7 -7 -13 -3 -13 26 0 -53 -58 -85 -62 -3 -1 -30 -13 -60 -29 -74 -37 -114 -88 -188 -234 -9 -16 -19 -32 -23 -35 -5 -3 -10 -15 -12 -25 -1 -11 -10 -31 -19 -45 -9 -14 -25 -41 -35 -60 -10 -19 -31 -54 -46 -77 -15 -23 -28 -48 -29 -55 -2 -7 -10 -20 -19 -30 -8 -10 -35 -57 -60 -105 -24 -49 -48 -91 -53 -94 -5 -4 -6 -11 -2 -17 3 -6 2 -13 -4 -17 -15 -10 -12 -22 14 -49 27 -30 71 -34 101 -8 27 23 75 88 75 102 0 6 7 13 15 16 8 4 15 17 15 29 0 13 3 25 8 27 4 2 18 25 32 52 13 27 29 54 35 60 5 6 21 33 35 59 41 79 70 103 136 117 81 16 234 81 297 126 52 37 187 172 187 187 0 5 11 23 24 40 49 66 94 193 108 303 12 97 0 273 -21 297 -5 7 -9 14 -9 17 0 18 -17 68 -28 85 -8 11 -14 25 -14 33 0 39 -149 219 -222 268 -24 15 -47 33 -53 38 -27 29 -228 108 -251 99 -6 -2 -15 0 -19 6 -8 13 -218 12 -290 -1z" />
                </g>
              </svg>
              <span className="text-white text-2xl font-bold">Quickbites</span>
            </a>
            <p className="text-base">
              Quickbites is your go-to platform for fast, delicious meals
              delivered right to your door. We're committed to quality, speed,
              and customer satisfaction.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="ml-20">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <button
                  className="text-white font-light hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showAboutUs}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  className="text-white font-light hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showContact}
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  className="text-white font-light hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showPrivacyPolicy}
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  className="text-white font-light hover:font-bold cursor-pointer bg-transparent border-none p-0 text-left"
                  onClick={showTermsOfService}
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Food Features Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Elevate Your Dining Experience{" "}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-300 p-3 rounded">
                <h4 className="font-semibold text-sm">Convenience</h4>
                <p className="text-xs mt-1">Order anytime, anywhere.</p>
              </div>
              <div className="bg-orange-300 p-3 rounded">
                <h4 className="font-semibold text-sm">Effortless Payment</h4>
                <p className="text-xs mt-1">
                  Secure and convenient payment methods.
                </p>
              </div>
              <div className="bg-orange-300 p-3 rounded">
                <h4 className="font-semibold text-sm">Efficiency</h4>
                <p className="text-xs mt-1">
                  Skip lines and save time with reliable service
                </p>
              </div>
              <div className="bg-orange-300 p-3 rounded">
                <h4 className="font-semibold text-sm">Cuisine Variety</h4>
                <p className="text-xs mt-1">
                  From Italian to Thai, we've got it all!
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="https://facebook.com" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.49V14.706h-3.13v-3.623h3.13V8.412c0-3.1 1.892-4.788 4.657-4.788 1.324 0 2.463.098 2.796.142v3.24h-1.918c-1.504 0-1.795.714-1.795 1.762v2.313h3.59l-.467 3.623h-3.123V24h6.127C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M24 4.557a9.864 9.864 0 0 1-2.828.775 4.935 4.935 0 0 0 2.165-2.724 9.86 9.86 0 0 1-3.127 1.195 4.918 4.918 0 0 0-8.384 4.482A13.956 13.956 0 0 1 1.671 3.149a4.917 4.917 0 0 0 1.523 6.573A4.897 4.897 0 0 1 .964 9.1v.062a4.914 4.914 0 0 0 3.941 4.816 4.901 4.901 0 0 1-2.212.084 4.915 4.915 0 0 0 4.588 3.417A9.867 9.867 0 0 1 0 20.354a13.944 13.944 0 0 0 7.548 2.212c9.056 0 14.01-7.505 14.01-14.01 0-.213-.005-.425-.015-.636A9.99 9.99 0 0 0 24 4.557z" />
                </svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-instagram-icon lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.287c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.287h-3v-4.978c0-1.187-.021-2.714-1.656-2.714-1.656 0-1.911 1.296-1.911 2.636v5.056h-3v-10h2.879v1.384h.042c.401-.759 1.379-1.559 2.841-1.559 3.04 0 3.6 2 3.6 4.604v5.571z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-orange-300 pt-4 text-center">
          <p className="text-sm font-semibold">
            © 2025 Quickbites. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Modal Implementation */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{modalTitle}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="text-gray-700">{modalContent}</div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
