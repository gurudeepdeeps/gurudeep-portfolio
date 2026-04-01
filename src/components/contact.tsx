import { motion } from "framer-motion";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { ID } from "appwrite";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { styles } from "../styles";
import { slideIn } from "../utils/motion";
import { databases, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ENQUIRIES } from "../lib/appwrite";

// Contact
export const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // handle form change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
  };

  // validate form on submit
  const validateForm = () => {
    const { name, email, message } = form;
    const errors: { [key: string]: boolean } = { name: true, email: true, message: true };

    const nameError = document.querySelector("#name-error")!;
    const emailError = document.querySelector("#email-error")!;
    const messageError = document.querySelector("#message-error")!;

    if (name.trim().length < 3) {
      nameError.classList.remove("hidden");
      errors.name = false;
    } else {
      nameError.classList.add("hidden");
    }

    const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.trim().toLowerCase().match(email_regex)) {
      emailError.classList.remove("hidden");
      errors.email = false;
    } else {
      emailError.classList.add("hidden");
    }

    if (message.trim().length < 5) {
      messageError.classList.remove("hidden");
      errors.message = false;
    } else {
      messageError.classList.add("hidden");
    }

    return Object.values(errors).every(Boolean);
  };

  // handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return false;

    setLoading(true);

    try {
      // Send to Appwrite instead of Web3Forms/EmailJS
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

      toast.success("Message sent successfully! I'll get back to you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
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
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium disabled:opacity-50"
              />
              <span className="text-red-400 mt-2 hidden" id="name-error">
                Name must be at least 3 characters.
              </span>
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
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium disabled:opacity-50"
              />
              <span className="text-red-400 mt-2 hidden" id="email-error">
                Please enter a valid email address.
              </span>
            </label>

            <label htmlFor="phone" className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Phone</span>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
                disabled={loading}
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium disabled:opacity-50"
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
                placeholder="Hello there!"
                disabled={loading}
                className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium disabled:opacity-50 resize-none"
              />
              <span className="text-red-400 mt-2 hidden" id="message-error">
                Message must be at least 5 characters.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
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
