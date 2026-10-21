# GROUNDWORK / BUILD & MAINTAIN — Zambia construction website

A responsive HTML, CSS and vanilla JavaScript website prototype for a construction, renovation, finishing and property maintenance business serving customers in Zambia. **GROUNDWORK is a fictional placeholder identity.** No real contractor, completed project, qualification, customer testimonial, guarantee or licence is being claimed.

## Files

- `index.html` — **self-contained entrypoint** with HTML, CSS and JavaScript embedded; open this directly to run the demo.
- `index-modular.html` — alternative page that loads the separate `styles.css` and `script.js` files.
- `styles.css` — editable stylesheet source for the modular version.
- `script.js` — editable JavaScript source for the modular version.

## Run it

1. Extract the ZIP file.
2. Open `index.html` in a modern browser. It includes all page CSS and JavaScript in the HTML file; no build process or framework is required.
3. Or open `index-modular.html` to work with the separate CSS/JS source files. If you edit the modular source and want the standalone file updated, copy the changes into `index.html` as well.
4. Internet access is needed for the externally hosted photos, Google Fonts and embedded YouTube video. Images are hotlinked from Unsplash/Pexels; the embedded video is an external educational example, not the business's own footage.

For best local testing, run a simple static server from this folder (optional):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Customise before launch

In the standalone `index.html`, find the `const BUSINESS = { ... }` object near the end of the file and edit it. For the modular version, edit the same object near the top of `script.js`:

- `name`, `serviceArea`, `phone`, `whatsapp`, `email`, `address`, `workingHours`, `website`, `socialLinks`, and `verifiedQualifications`.
- `whatsapp` should contain digits only, including the country code (for example `260...`). Do not enter a made-up number.
- `email` must be an inbox the business monitors.
- The business schema is updated from the configured values; publish only accurate details.

Also update the visible name, service-area wording, contact copy, page title and meta description in `index.html`. Remove services that are not genuinely offered, especially regulated/specialist work. Replace all demonstration portfolio entries and photos with genuine images that the business owns or is authorised to publish. Obtain client permission before identifying locations or showing private property details. The current photos are third-party stock imagery and are not claimed as business projects.

## Quote form behaviour and limits

The six-step form validates required fields, checks date and contact formats, filters allowed attachment types and size (up to five JPG/PNG/WEBP/PDF files, 5 MB each), shows a review summary and prepares a readable request message. It does **not** calculate a construction price or issue a binding quotation. It does not upload, store or attach selected files. WhatsApp/email are only opened after the owner configures a contact in `script.js`; otherwise, the request text can be copied manually. The customer still has to send the message in their app.

## Production requirements not included

A real business launch may need:

- A secure backend/API to receive enquiries, validate input server-side, store records and deliver notifications.
- Secure file storage and upload limits/scanning if project files must be uploaded; privacy notice, retention rules, access controls and consent handling.
- Spam protection/rate limiting and server-side validation.
- A clear privacy policy, retention/deletion process and operational response procedure.
- Confirmed service area, contact details, opening hours, genuine portfolio and verified qualifications/registration/insurance claims where applicable.
- Business-owned domain/hosting, analytics only with appropriate disclosure/consent, and accessibility/browser/device QA.
- A written quotation workflow, site assessment arrangements, materials/scope/exclusions, payment stages, variation approval and handover terms managed by the actual business.

No payment function, database, appointment booking, secure upload, email service, CRM or server-side storage is implemented.
