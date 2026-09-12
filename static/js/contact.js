/**
 * MAX VERSTAPPEN — ASYNC CONTACT FORM SUBMISSION
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactFormAjax');
  const feedbackEl = document.getElementById('contactFeedback');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Bot honeypot check
    if (data.bot_catcher) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>TRANSMITTING...</span>';
    }

    if (feedbackEl) {
      feedbackEl.className = 'contact-form-feedback';
      feedbackEl.textContent = '';
    }

    try {
      const response = await fetch('/api/contact/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': data.csrfmiddlewaretoken || getCsrfCookie(),
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        if (feedbackEl) {
          feedbackEl.className = 'contact-form-feedback success';
          feedbackEl.textContent = resData.message || '✓ Transmission confirmed. Management will review your message shortly.';
        }
        contactForm.reset();
      } else {
        if (feedbackEl) {
          feedbackEl.className = 'contact-form-feedback error';
          feedbackEl.textContent = 'Submission error. Please verify the required fields.';
        }
      }
    } catch (err) {
      if (feedbackEl) {
        feedbackEl.className = 'contact-form-feedback error';
        feedbackEl.textContent = 'Transmission failed. Please check your network connection.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>SUBMIT</span> <span class="submit-arrow">&raquo;</span>';
      }
    }
  });

  function getCsrfCookie() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, 10) === 'csrftoken=') {
          cookieValue = decodeURIComponent(cookie.substring(10));
          break;
        }
      }
    }
    return cookieValue;
  }
});
