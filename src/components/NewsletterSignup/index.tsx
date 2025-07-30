"use client";

import { useRef, useEffect } from "react";
import { isEmail } from "@/utils/isEmail";
import { useContent } from "@/hooks/useContent";
import { getDataLayer } from "@/analytics/DataLayer";
import Well from "@/components/Well";
import styles from "./styles.module.scss";

const mailchimpHtml = `
<div id="mc_embed_shell">
  
<div id="mc_embed_signup">
    <form action="https://hechingerreport.us2.list-manage.com/subscribe/post?u=66c306eebb323868c3ce353c1&amp;id=53ffce5e64&amp;f_id=003ab3e0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_self" novalidate="">
        <div id="mc_embed_signup_scroll"><h2>Subscribe</h2>
            <div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
            <div class="mc-field-group"><label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label><input type="email" name="EMAIL" class="required email" id="mce-EMAIL" required="" value=""></div>
        <div id="mce-responses" class="clear">
            <div class="response" id="mce-error-response" style="display: none;"></div>
            <div class="response" id="mce-success-response" style="display: none;"></div>
        </div><div aria-hidden="true" style="position: absolute; left: -5000px;"><input type="text" name="b_66c306eebb323868c3ce353c1_53ffce5e64" tabindex="-1" value=""></div><div class="clear"><input type="submit" name="subscribe" id="mc-embedded-subscribe" class="button" value="Subscribe"></div>
    </div>
</form>
</div>
</div>
`;

/**
 * The newsletter signup component. Renders a simple promo signup
 * form for a newsletter campaign.
 */
export default function Newsletter() {
  const content = useContent();

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;

    const submit = ref.current.querySelector("input[type=submit][name=subscribe]");
    const email = ref.current.querySelector("input[type=email]") as HTMLInputElement;

    if (!submit || !email) return;

    const track = () => {
      const emailValue = email.value;
      if (!isEmail(emailValue)) return;
      getDataLayer().push({
        event: "newsletter",
        newsletterName: "Tuition Tracker",
        email: emailValue,
      });
    };
    submit.addEventListener("click", track);
    return () => {
      submit.removeEventListener("click", track);
    };
  }, []);

  return (
    <Well width="text">
      <div className={styles.newsletter}>
        <h2 className={styles.title}>
          {content("Newsletter.title")}
        </h2>

        <p className={styles.blurb}>
          {content("Newsletter.blurb")}
        </p>

        <div
          ref={ref}
          className={styles.mailchimp}
          dangerouslySetInnerHTML={{ __html: mailchimpHtml }}
        />

      </div>
    </Well>
  );
}
