import { motion } from "framer-motion";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { ID } from "appwrite";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ENQUIRIES } from "../lib/appwrite";

import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { cn } from "../utils/lib";

// Contact
export const Contact = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; consent?: string }>({});
  const [loading, setLoading] = useState(false);

  // handle form change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Live error clearing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // validate form on submit
  const validateForm = () => {
    const newErrors: { name?: string; email?: string; message?: string; consent?: string } = {};
    const { name, email, message } = form;

    if (name.trim().length < 3) {
      newErrors.name = "Please enter your name (at least 3 characters).";
    }

    const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.trim().toLowerCase().match(email_regex)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters.";
    }

    if (!consent) {
      newErrors.consent = "Please provide your consent to process your contact details as per the DPDP Act.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Send to Appwrite Database
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ENQUIRIES,
        ID.unique(),
        {
          name: form.name,
          email: form.email.trim().toLowerCase(),
          phone: form.phone || "Not provided",
          message: form.message,
          created_at: new Date().toISOString(),
        }
      );

      toast.success("Message sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setConsent(false);

      // Redirect to Thank You Page
      navigate("/thank-you");
    } catch (error: any) {
      console.error("[CONTACT_ERROR]: ", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionWrapper idName="contact">
      <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
        >
          <p className={styles.sectionSubText}>Get in touch</p>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <label htmlFor="name" className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Name*</span>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                disabled={loading}
                className={cn(
                  "bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium disabled:opacity-50 transition-all border",
                  errors.name
                    ? "border-red-500/80 bg-red-500/10 focus:border-red-500"
                    : "border-transparent focus:border-indigo-500/50"
                )}
              />
              {errors.name && (
                <span className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} /> {errors.name}
                </span>
              )}
            </label>

            <label htmlFor="email" className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Email*</span>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                disabled={loading}
                className={cn(
                  "bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium disabled:opacity-50 transition-all border",
                  errors.email
                    ? "border-red-500/80 bg-red-500/10 focus:border-red-500"
                    : "border-transparent focus:border-indigo-500/50"
                )}
              />
              {errors.email && (
                <span className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} /> {errors.email}
                </span>
              )}
            </label>

            <label htmlFor="phone" className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Phone (Optional)</span>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91-7353577717"
                disabled={loading}
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border border-transparent focus:border-indigo-500/50 font-medium disabled:opacity-50"
              />
            </label>

            <label htmlFor="message" className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Message*</span>
              <textarea
                rows={7}
                name="message"
                id="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Hello Gurudeep, I'd like to discuss a project..."
                disabled={loading}
                className={cn(
                  "bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none font-medium disabled:opacity-50 resize-none transition-all border",
                  errors.message
                    ? "border-red-500/80 bg-red-500/10 focus:border-red-500"
                    : "border-transparent focus:border-indigo-500/50"
                )}
              />
              {errors.message && (
                <span className="text-red-400 text-xs mt-2 flex items-center gap-1.5 font-medium">
                  <AlertCircle size={14} /> {errors.message}
                </span>
              )}
            </label>

            {/* DPDP Act 2023 Compliant Consent Section */}
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-tertiary/70 border border-white/5">
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  id="dpdp-consent"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) {
                      setErrors((prev) => ({ ...prev, consent: undefined }));
                    }
                  }}
                  disabled={loading}
                  className="mt-1 w-4 h-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-[#0a0a0a] cursor-pointer shrink-0"
                />
                <span className="text-xs text-white/80 leading-relaxed">
                  I consent to the collection and processing of my name, email, phone number, and message by Gurudeep V under the{" "}
                  <strong className="text-white font-medium">Digital Personal Data Protection (DPDP) Act, 2023</strong> solely for responding to my project inquiry. I understand I may withdraw my consent or request data erasure at any time as detailed in the{" "}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-indigo-400 underline hover:text-indigo-300 font-medium"
                  >
                    Privacy Policy
                  </Link>.
                </span>
              </label>

              {errors.consent && (
                <span className="text-red-400 text-xs flex items-center gap-1.5 font-medium pl-7">
                  <AlertCircle size={14} /> {errors.consent}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl disabled:opacity-50 flex items-center gap-2 hover:bg-tertiary/80 transition-all"
            >
              <Send size={16} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>

        <motion.div
          variants={slideIn("right", "tween", 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
