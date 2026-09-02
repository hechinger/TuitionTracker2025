"use client";

import { useEffect, useRef, useState } from "react";
import { isEmail } from "@/utils/isEmail";
import { getDataLayer } from "@/analytics/DataLayer";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

const ACTION_URL = "https://hechingerreport.bluelena.io/proc.php";

const COPY = {
  title: "Found your net price? Good start.",
  blurb: "Get the full picture with our free 7-part course on applying to college and paying for it. Launches in September.",
  emailLabel: "Email",
  emailPlaceholder: "Type your email",
  submit: "Submit",
  submitting: "Submitting…",
  thankYou: "Thank you for signing up! Keep an eye out for our launch in September.",
  invalidEmail: "Enter a valid email address.",
  submitError: "Sorry your submission failed. Please try again.",
  captchaPrompt: "Please confirm you're not a robot below, then submit again.",
};

/**
 * Hidden fields required by BlueLena/ActiveCampaign to route a submission
 * to the right list. "or" acts as the form/account identifier in lieu of
 * an API key.
 */
const HIDDEN_FIELDS: Record<string, string> = {
  u: "4",
  f: "4",
  s: "",
  c: "0",
  m: "0",
  act: "sub",
  v: "2",
  or: "a957ad66-edc3-4dc8-ba7a-4d1188859d63",
};

type BlueLenaCallbacks = {
  onThankYou: () => void;
  onError: (message: string, html?: string) => void;
};

declare global {
  interface Window {
    __blueLenaCallbacks?: Record<string, BlueLenaCallbacks>;
    _show_thank_you?: (id: string, message: string, trackcmpUrl?: string, email?: string) => void;
    _show_error?: (id: string, message: string, html?: string) => void;
    _load_script?: (url: string, callback?: () => void) => void;
    // Defined by BlueLena's response; renders any ".g-recaptcha" element found
    // in the DOM using its "data-sitekey" attribute.
    recaptcha_callback?: () => void;
    grecaptcha?: { reset: (widgetId?: number) => void };
  }
}

/**
 * BlueLena's form endpoint responds with a <script> body that calls these
 * globals directly (JSONP-style), rather than returning JSON we can parse
 * from a normal fetch. Registering them here lets us route that callback
 * into this component's own state instead of their default DOM-swapping.
 * "_load_script" is also called directly by that response (e.g. to load a
 * tracking pixel after a successful submission), so it needs to exist even
 * though we never call it ourselves.
 */
function registerBlueLenaCallbacks(formId: string, callbacks: BlueLenaCallbacks) {
  window.__blueLenaCallbacks = window.__blueLenaCallbacks || {};
  window.__blueLenaCallbacks[formId] = callbacks;

  window._show_thank_you = (id) => {
    window.__blueLenaCallbacks?.[id]?.onThankYou();
  };
  window._show_error = (id, message, html) => {
    window.__blueLenaCallbacks?.[id]?.onError(message, html);
  };
  window._load_script = (url, callback) => {
    const script = document.createElement("script");
    script.charset = "utf-8";
    script.src = url;
    if (callback) {
      script.onload = () => callback();
    }
    document.head.appendChild(script);
  };
}

function unregisterBlueLenaCallbacks(formId: string) {
  delete window.__blueLenaCallbacks?.[formId];
}

/**
 * Signup form for the college application newsletter course. Submits
 * directly to BlueLena/ActiveCampaign, but with our own markup and
 * styling in place of their embed code.
 */
export default function NewsletterCourseSignup() {
  const formId = HIDDEN_FIELDS.u;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>();

  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerBlueLenaCallbacks(formId, {
      onThankYou: () => {
        setStatus("success");
        getDataLayer().push({
          event: "newsletter",
          newsletterName: "Tuition Tracker Course",
          email,
        });
      },
      onError: (message, html) => {
        setStatus("error");

        // When BlueLena wants a captcha, it sends the widget markup as "html"
        // and separately loads Google's script, whose onload handler renders
        // any ".g-recaptcha" element it finds. We just have to get that
        // element into the DOM for it to pick up.
        if (!html || !captchaRef.current) {
          setErrorMessage(message);
          return;
        }

        setErrorMessage(COPY.captchaPrompt);

        if (captchaRef.current.hasChildNodes()) {
          // Already rendered: just clear the previous (used) response.
          window.grecaptcha?.reset();
          return;
        }

        captchaRef.current.innerHTML = html;
        // If Google's script already loaded on an earlier attempt, its onload
        // handler won't fire again, so render the new element ourselves.
        if (window.grecaptcha) {
          window.recaptcha_callback?.();
        }
      },
    });

    return () => unregisterBlueLenaCallbacks(formId);
  }, [formId, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEmail(email)) {
      setStatus("error");
      setErrorMessage(COPY.invalidEmail);
      return;
    }

    setStatus("submitting");
    setErrorMessage(undefined);

    const params = new URLSearchParams({
      ...HIDDEN_FIELDS,
      email,
      jsonp: "true",
    });

    // Google injects this hidden field into the widget once it's solved.
    const captchaResponse = captchaRef.current
      ?.querySelector<HTMLTextAreaElement>("textarea[name='g-recaptcha-response']")
      ?.value;
    if (captchaResponse) {
      params.set("g-recaptcha-response", captchaResponse);
    }

    const script = document.createElement("script");
    script.src = `${ACTION_URL}?${params.toString()}`;
    script.onerror = () => {
      setStatus("error");
      setErrorMessage(COPY.submitError);
    };
    script.addEventListener("load", () => script.remove());
    document.head.appendChild(script);
  };

  return (
    <Well width="text">
      <div className={styles.newsletter}>
        <h2 className={styles.title}>
          {COPY.title}
        </h2>

        <p className={styles.blurb}>
          {COPY.blurb}
        </p>

        {status === "success" ? (
          <p className={styles.thankYou}>
            {COPY.thankYou}
          </p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="newsletter-course-email">
                {COPY.emailLabel}
                <span className={styles.required}>*</span>
              </label>
              <input
                id="newsletter-course-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={COPY.emailPlaceholder}
              />
            </div>

            {status === "error" && errorMessage && (
              <p className={styles.error}>{errorMessage}</p>
            )}

            {/* Populated by BlueLena's captcha response, not by React */}
            <div ref={captchaRef} className={styles.captcha} />

            <button type="submit" className={styles.submit} disabled={status === "submitting"}>
              {status === "submitting" ? COPY.submitting : COPY.submit}
            </button>
          </form>
        )}
      </div>
    </Well>
  );
}
