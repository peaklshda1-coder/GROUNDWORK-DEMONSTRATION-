/*
 * GROUNDWORK demo website — owner configuration and front-end interactions.
 * No server, database, file upload, payment or automatic quote calculation is included.
 */
'use strict';

const BUSINESS = {
  name: 'GROUNDWORK / BUILD & MAINTAIN',
  country: 'Zambia',
  serviceArea: 'Confirm the actual service area before publishing',
  phone: '',                 // e.g. +260 97X XXX XXX — replace with verified number
  whatsapp: '',              // digits only with country code, e.g. 26097XXXXXXX
  email: '',                 // replace with a monitored business email
  address: '',               // optional; publish only if appropriate
  workingHours: '',          // replace with confirmed hours
  website: '',               // full canonical URL after deployment
  socialLinks: [],           // e.g. [{ label: 'Facebook', url: 'https://...' }]
  verifiedQualifications: [] // add only verified qualifications / registrations
};

const PROJECT_TEMPLATES = {
  construction: {
    title: 'From site preparation to structure',
    fields: [
      ['Project type', 'Residential construction / extension'],
      ['Location', 'Add approved town or general area only'],
      ['Scope', 'Describe the agreed site preparation, structural and related work'],
      ['Materials', 'List confirmed material specifications and supply responsibilities'],
      ['Status', 'Set to proposed / in progress / completed only when accurate'],
      ['Challenge & solution', 'Describe the actual challenge and documented response'],
      ['Evidence', 'Add genuine, authorised before / during / after photographs']
    ]
  },
  renovation: {
    title: 'A considered interior refresh',
    fields: [
      ['Project type', 'Renovation / alterations'], ['Location', 'Approved general area'],
      ['Scope', 'List rooms, surfaces, repairs and agreed exclusions'], ['Materials', 'Record confirmed finishes and who supplied them'],
      ['Status', 'Proposed / in progress / completed — verify before display'], ['Challenge & solution', 'Explain the actual condition and work carried out'],
      ['Evidence', 'Use real images with permission']
    ]
  },
  repairs: {
    title: 'Small repairs, recorded properly',
    fields: [
      ['Project type', 'Property repair / maintenance'], ['Location', 'Approved general area'],
      ['Scope', 'Describe the fault and agreed repair'], ['Materials', 'List replacement parts and consumables'],
      ['Status', 'Only display the true current status'], ['Challenge & solution', 'Describe diagnosis, repair and checks completed'],
      ['Evidence', 'Use authorised photos without exposing private details']
    ]
  },
  finishing: {
    title: 'Clean lines, careful finish',
    fields: [
      ['Project type', 'Finishing / interior fit-out'], ['Location', 'Approved general area'],
      ['Scope', 'List surface preparation and finish work'], ['Materials', 'Specify products / finish only if known'],
      ['Status', 'Set using the actual project status'], ['Challenge & solution', 'Explain the work and decisions accurately'],
      ['Evidence', 'Use genuine project photographs with permission']
    ]
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Set the footer year and make the mobile navigation keyboard-accessible.
$('#year').textContent = new Date().getFullYear();
const menuToggle = $('.menu-toggle');
const mainNav = $('#main-nav');
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mainNav.classList.toggle('open', !isOpen);
});
$$('#main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}));

// Service catalogue filter.
$$('[data-service-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.serviceFilter;
    $$('[data-service-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $$('.service-row').forEach(row => {
      row.hidden = selected !== 'all' && row.dataset.category !== selected;
    });
  });
});

// Portfolio filters only filter the clearly-labelled demonstration case studies.
$$('[data-project-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.projectFilter;
    $$('[data-project-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $$('.project-card').forEach(card => {
      card.hidden = selected !== 'all' && card.dataset.projectCategory !== selected;
    });
  });
});

// Case-study template dialog. This does not claim any sample is a real project.
const caseDialog = $('#case-dialog');
$$('[data-case]').forEach(button => button.addEventListener('click', () => {
  const data = PROJECT_TEMPLATES[button.dataset.case];
  if (!data) return;
  $('#dialog-title').textContent = data.title;
  const dl = document.createElement('dl');
  data.fields.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = value;
    dl.append(dt, dd);
  });
  $('#dialog-body').replaceChildren(dl);
  if (typeof caseDialog.showModal === 'function') caseDialog.showModal();
  else caseDialog.setAttribute('open', '');
}));
$('.dialog-close').addEventListener('click', () => caseDialog.close());
$('.dialog-done').addEventListener('click', () => caseDialog.close());
caseDialog.addEventListener('click', event => {
  if (event.target === caseDialog) caseDialog.close();
});

// Multi-step quote enquiry. All values remain in the current browser page until handoff.
const form = $('#quote-form');
const steps = $$('.form-step', form);
const stepLabel = $('#step-label');
const stepTitle = $('#step-title');
const progressFill = $('#progress-fill');
const progressSteps = $$('.progress-steps span');
const fileInput = $('#attachments');
const fileList = $('#file-list');
const handoffResult = $('#handoff-result');
const startDate = $('#start-date');
let currentStep = 0;
let acceptedFiles = [];
const stepNames = ['Project brief', 'Site location', 'Project details', 'Photos & documents', 'Contact details', 'Review request'];
const MAX_FILE_COUNT = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

// Prevent selecting a preferred date in the past.
if (startDate) startDate.min = new Date().toISOString().slice(0, 10);

function setStep(index) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, i) => {
    const active = i === currentStep;
    step.classList.toggle('active', active);
    step.setAttribute('aria-hidden', String(!active));
  });
  stepLabel.textContent = `STEP ${String(currentStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
  stepTitle.textContent = stepNames[currentStep];
  progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  progressSteps.forEach((node, i) => {
    node.classList.toggle('current', i === currentStep);
    if (i === currentStep) node.setAttribute('aria-current', 'step');
    else node.removeAttribute('aria-current');
  });
  clearStepError(steps[currentStep]);
  handoffResult.hidden = true;
  if (currentStep === 5) renderReview();
  const legend = $('legend', steps[currentStep]);
  if (legend) legend.setAttribute('tabindex', '-1'), legend.focus({ preventScroll: true });
}

function clearStepError(step) {
  const error = $('.field-error', step);
  if (error) error.textContent = '';
}

function showStepError(step, message) {
  const error = $('.field-error', step);
  if (error) error.textContent = message;
}

function validateCurrentStep() {
  const step = steps[currentStep];
  clearStepError(step);
  if (currentStep === 3) return true; // attachments are optional; invalid files are rejected on selection
  const requiredFields = $$('[required]', step).filter(el => el.type !== 'file');
  for (const field of requiredFields) {
    if (field.type === 'checkbox' && !field.checked) {
      showStepError(step, 'Please confirm the consent statement to continue.');
      field.focus();
      return false;
    }
    if (field.type !== 'checkbox' && !field.value.trim()) {
      showStepError(step, 'Please complete the required field(s) before continuing.');
      field.focus();
      return false;
    }
    if (field.id === 'description' && field.value.trim().length < 10) {
      showStepError(step, 'Please describe the job in a little more detail (at least 10 characters).');
      field.focus();
      return false;
    }
    if (field.id === 'customer-name' && field.value.trim().length < 2) {
      showStepError(step, 'Please enter a name of at least 2 characters.');
      field.focus();
      return false;
    }
    if (field.id === 'phone' && !isPlausiblePhone(field.value)) {
      showStepError(step, 'Please check the phone number. Include the Zambia country code (+260) if appropriate.');
      field.focus();
      return false;
    }
    if (field.type === 'email' && field.value.trim() && !field.validity.valid) {
      showStepError(step, 'Please enter a valid email address or leave this optional field blank.');
      field.focus();
      return false;
    }
  }
  const email = $('#email');
  if (currentStep === 4 && email.value.trim() && !email.validity.valid) {
    showStepError(step, 'Please enter a valid email address or leave this optional field blank.');
    email.focus();
    return false;
  }
  if (currentStep === 2 && startDate.value) {
    const selectedDate = new Date(`${startDate.value}T00:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      showStepError(step, 'Preferred start date cannot be in the past.');
      startDate.focus();
      return false;
    }
  }
  return true;
}

function isPlausiblePhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

$$('.next-step').forEach(button => button.addEventListener('click', () => {
  if (validateCurrentStep()) setStep(currentStep + 1);
}));
$$('.prev-step').forEach(button => button.addEventListener('click', () => setStep(currentStep - 1)));

// Service CTA preselects the requested service and takes the visitor to the form.
$$('[data-choose-service]').forEach(button => button.addEventListener('click', () => {
  const service = $('#service');
  const requested = button.dataset.chooseService;
  const matching = [...service.options].find(option => option.value === requested || option.text === requested);
  if (matching) service.value = matching.value;
  else if (/roof|plumb|electrical/i.test(requested)) service.value = 'Roofing, plumbing or electrical enquiry';
  else service.value = 'Other / not sure yet';
  document.querySelector('#quote').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  setStep(0);
}));

fileInput.addEventListener('change', () => {
  const files = [...fileInput.files];
  const errors = [];
  if (files.length > MAX_FILE_COUNT) errors.push(`Select no more than ${MAX_FILE_COUNT} files.`);
  files.slice(0, MAX_FILE_COUNT).forEach(file => {
    if (!ALLOWED_MIME.has(file.type)) errors.push(`${file.name}: unsupported type. Use JPG, PNG, WEBP or PDF.`);
    if (file.size > MAX_FILE_BYTES) errors.push(`${file.name}: larger than 5 MB.`);
  });
  if (errors.length) {
    acceptedFiles = [];
    fileInput.value = '';
    fileList.replaceChildren();
    showStepError(steps[3], errors.join(' '));
    return;
  }
  clearStepError(steps[3]);
  acceptedFiles = files;
  fileList.replaceChildren();
  files.forEach(file => {
    const li = document.createElement('li');
    li.textContent = `${file.name} — ${(file.size / (1024 * 1024)).toFixed(2)} MB (not uploaded)`;
    fileList.append(li);
  });
});

function formValue(id, fallback = 'Not provided') {
  const field = $(`#${id}`);
  if (!field) return fallback;
  if (field.type === 'checkbox') return field.checked ? 'Yes' : 'No';
  return field.value.trim() || fallback;
}

function getRequestData() {
  return {
    service: formValue('service'),
    description: formValue('description'),
    area: formValue('area'),
    siteAddress: formValue('site-address', 'Not provided'),
    propertyType: formValue('property-type'),
    dimensions: formValue('dimensions'),
    condition: formValue('condition'),
    materials: formValue('materials'),
    startDate: formValue('start-date'),
    budget: formValue('budget'),
    extraDetails: formValue('extra-details'),
    fileNames: acceptedFiles.length ? acceptedFiles.map(file => file.name).join(', ') + ' (not attached)' : 'None selected',
    customerName: formValue('customer-name'),
    phone: formValue('phone'),
    email: formValue('email', 'Not provided'),
    contactMethod: formValue('contact-method'),
    consent: formValue('consent', 'No')
  };
}

function makeRequestMessage(data) {
  return [
    `PROJECT ENQUIRY — ${BUSINESS.name}`,
    'This is a request for assessment / quotation, not an accepted quotation or agreed price.',
    '',
    `Service: ${data.service}`,
    `Job description: ${data.description}`,
    `General area: ${data.area}`,
    `Site directions/address: ${data.siteAddress}`,
    `Property type: ${data.propertyType}`,
    `Approximate dimensions: ${data.dimensions}`,
    `Existing condition: ${data.condition}`,
    `Materials / finish preferences: ${data.materials}`,
    `Preferred start date: ${data.startDate}`,
    `Budget range: ${data.budget}`,
    `Additional details: ${data.extraDetails}`,
    `Selected files: ${data.fileNames}`,
    '',
    `Customer name: ${data.customerName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Preferred contact: ${data.contactMethod}`,
    '',
    'Please confirm the next step, any site assessment requirements and whether a written quotation can be provided.',
    'Note: files selected on the website are not uploaded or attached. I will send any relevant photos separately if needed.'
  ].join('\n');
}

function renderReview() {
  const data = getRequestData();
  const labels = [
    ['Service', 'service'], ['Job description', 'description'], ['General area', 'area'],
    ['Site address / directions', 'siteAddress'], ['Property type', 'propertyType'],
    ['Approx. dimensions', 'dimensions'], ['Existing condition', 'condition'], ['Materials / finish', 'materials'],
    ['Preferred start', 'startDate'], ['Budget range', 'budget'], ['Additional details', 'extraDetails'],
    ['Selected files', 'fileNames'], ['Name', 'customerName'], ['Phone', 'phone'],
    ['Email', 'email'], ['Preferred contact', 'contactMethod']
  ];
  const dl = document.createElement('dl');
  dl.className = 'review-summary';
  labels.forEach(([label, key]) => {
    const row = document.createElement('div'); row.className = 'review-item';
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = data[key];
    row.append(dt, dd); dl.append(row);
  });
  $('#review-summary').replaceChildren(dl);
}

$('#send-request').addEventListener('click', () => {
  const data = getRequestData();
  const message = makeRequestMessage(data);
  const method = $('#send-method').value;
  handoffResult.hidden = false;
  handoffResult.replaceChildren();
  const heading = document.createElement('strong');
  const info = document.createElement('p');
  const textArea = document.createElement('textarea');
  textArea.readOnly = true;
  textArea.setAttribute('aria-label', 'Prepared project enquiry message');
  textArea.value = message;
  handoffResult.append(heading, info);

  if (method === 'whatsapp' && BUSINESS.whatsapp.trim()) {
    heading.textContent = 'WhatsApp draft is ready.';
    info.textContent = 'Your messaging app should open with the prepared text. Review it and press Send yourself. Selected files are not attached.';
    const link = document.createElement('a');
    link.className = 'button button-orange'; link.textContent = 'Open WhatsApp ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.href = `https://wa.me/${BUSINESS.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    handoffResult.append(link, textArea);
  } else if (method === 'email' && BUSINESS.email.trim()) {
    heading.textContent = 'Email draft is ready.';
    info.textContent = 'Your email app should open. Review the details and send it yourself. Selected files are not attached.';
    const subject = `Project enquiry — ${data.service}`;
    const link = document.createElement('a');
    link.className = 'button button-orange'; link.textContent = 'Open email app ↗';
    link.href = `mailto:${BUSINESS.email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    handoffResult.append(link, textArea);
  } else {
    heading.textContent = 'Copy your project enquiry.';
    info.textContent = 'No verified business contact is configured for this method. Copy the message and send it using the correct business contact. Nothing has been submitted.';
    handoffResult.append(textArea);
  }
  const copyButton = document.createElement('button');
  copyButton.type = 'button'; copyButton.className = 'button button-outline'; copyButton.textContent = 'Copy message text';
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      copyButton.textContent = 'Copied';
    } catch (_) {
      textArea.focus(); textArea.select();
      copyButton.textContent = 'Select text and copy';
    }
  });
  handoffResult.append(copyButton);
  handoffResult.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
});

// Optional local business schema: populate only from verified values supplied by the owner.
function updateBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: BUSINESS.name,
    description: 'Construction, renovation, finishing and property maintenance. Contact the business to confirm current services and availability.',
    areaServed: { '@type': 'Country', name: BUSINESS.country }
  };
  if (BUSINESS.website) schema.url = BUSINESS.website;
  if (BUSINESS.phone) schema.telephone = BUSINESS.phone;
  if (BUSINESS.email) schema.email = BUSINESS.email;
  if (BUSINESS.address) schema.address = { '@type': 'PostalAddress', streetAddress: BUSINESS.address, addressCountry: 'ZM' };
  if (BUSINESS.workingHours) schema.openingHours = BUSINESS.workingHours;
  if (BUSINESS.socialLinks.length) schema.sameAs = BUSINESS.socialLinks.map(link => link.url);
  $('#business-schema').textContent = JSON.stringify(schema);
}
updateBusinessSchema();
setStep(0);
