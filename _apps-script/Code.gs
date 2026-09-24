/**
 * guanxin.de contact form handler — Google Apps Script web app.
 *
 * What it does
 * ------------
 * Receives POSTs from the contact forms at guanxin.de/contact/ (EN) and
 * guanxin.de/de/kontakt/ (DE), lightly validates and spam-filters them, and
 * writes the enquiry straight into the hi@guanxin.de mailbox as a new unread
 * message from the visitor, with Reply-To set to them.
 *
 * Why not simply send an email: Gmail never delivers mail you send to your
 * own address into your own inbox — it only appears in Sent, where enquiries
 * would be missed. Inserting the message solves that, and uses no sending
 * quota because nothing leaves the account. If the insert ever fails, the
 * script falls back to sending a normal email (which lands in Sent).
 *
 * Nothing is written to a Spreadsheet or logged anywhere else — the mailbox
 * is the only copy of a submission (data-minimisation decision, see
 * README.md "Impressum, Datenschutz & contact form" → Decisions).
 *
 * Deploy (one-time, by the Workspace admin who owns hi@guanxin.de — see
 * README.md "Manual setup by the client" for the full walkthrough)
 * ------------------------------------------------------------------------
 * 1. Sign in to Google as the Workspace account that owns (or can send as)
 *    hi@guanxin.de.
 * 2. script.google.com → New project → name it "guanxin-contact-form" →
 *    paste this file's contents over the default Code.gs → Save.
 * 3. Editor ▸ Services (+) ▸ Gmail API ▸ Add. The insert below needs this
 *    advanced service; without it the script falls back to plain email.
 * 4. Deploy → New deployment → type "Web app". Execute as: Me. Who has
 *    access: Anyone. Authorize when prompted.
 * 5. Copy the web app URL (https://script.google.com/macros/s/…/exec) and
 *    give it to the implementer — it is not secret, it goes into the
 *    <form action> of both contact pages (currently the placeholder
 *    "REPLACE_WITH_APPS_SCRIPT_URL").
 * 6. If step 4 doesn't offer "Anyone": Admin console → Apps → Google
 *    Workspace → Drive and Docs → Sharing settings → allow sharing outside
 *    the organisation (Apps Script web apps follow this setting).
 * 7. Whenever this file changes: Deploy → Manage deployments → edit → pick
 *    "New version" (this keeps the same /exec URL — don't create a second
 *    deployment).
 */

var TO_ADDRESS = 'hi@guanxin.de';
var INBOX_LABEL = 'Contact form';
var MIN_FILL_SECONDS = 3;
var MAX_LENGTHS = { name: 200, email: 254, organisation: 200, message: 5000 };
var ALLOWED_TOPICS = [
    // EN (contact/)
    'Consulting project',
    'Role (permanent or fractional)',
    'Guanxin Labs / Singfinger',
    'Other',
    // DE (de/kontakt/)
    'Beratungsprojekt',
    'Stelle (Festanstellung oder Fractional)',
    'Sonstiges'
];

var THANK_YOU_COPY = {
    en: {
        successTitle: 'Message sent',
        successBody: "Thank you, your message has been sent. I'll get back to you soon.",
        errorTitle: 'Something went wrong',
        errorBody: 'Sorry, something went wrong. Please email hi@guanxin.de directly.',
        linkText: 'Back to guanxin.de/contact/',
        linkHref: 'https://guanxin.de/contact/'
    },
    de: {
        successTitle: 'Nachricht gesendet',
        successBody: 'Vielen Dank, Ihre Nachricht wurde gesendet. Ich melde mich in Kürze bei Ihnen.',
        errorTitle: 'Es ist ein Fehler aufgetreten',
        errorBody: 'Leider ist ein Fehler aufgetreten. Bitte schreiben Sie direkt an hi@guanxin.de.',
        linkText: 'Zurück zu guanxin.de/de/kontakt/',
        linkHref: 'https://guanxin.de/de/kontakt/'
    }
};

function doPost(e) {
    var params = (e && e.parameter) || {};
    var lang = params.lang === 'de' ? 'de' : 'en';
    var ok = handleSubmission(params);

    if (params.js === '1') {
        return ContentService
            .createTextOutput(JSON.stringify({ ok: ok }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    return thankYouPage(ok, lang);
}

/**
 * Validates and, if valid, emails the submission. Returns true on success
 * — including the "silent success" given to bots, so they learn nothing
 * from a rejection.
 */
function handleSubmission(params) {
    // Honeypot: a hidden field real visitors never fill in.
    if (trim(params.website)) {
        console.log('dropped: honeypot filled');
        return true;
    }

    // Minimum fill time: forms submitted implausibly fast after load are
    // almost always scripted.
    var loadedAt = Number(params.t);
    if (!loadedAt || (Date.now() - loadedAt) / 1000 < MIN_FILL_SECONDS) {
        console.log('dropped: submitted too fast (t=' + params.t + ')');
        return true;
    }

    var name = trim(params.name).replace(/[\r\n]+/g, ' '); // keep the subject line single-line
    var email = trim(params.email);
    var organisation = trim(params.organisation);
    var topic = trim(params.topic);
    var message = trim(params.message);

    if (!name || name.length > MAX_LENGTHS.name) return reject('name');
    if (!isValidEmail(email) || email.length > MAX_LENGTHS.email) return reject('email');
    if (organisation.length > MAX_LENGTHS.organisation) return reject('organisation');
    if (!message || message.length > MAX_LENGTHS.message) return reject('message');
    if (!topic || ALLOWED_TOPICS.indexOf(topic) === -1) return reject('topic: ' + topic);

    var subject = '[guanxin.de] ' + topic + ' \u2014 ' + name;
    var body = [
        'Name: ' + name,
        'Email: ' + email,
        'Organisation: ' + (organisation || '\u2014'),
        'Topic: ' + topic,
        '',
        message
    ].join('\n');

    try {
        insertIntoInbox(subject, body, name, email);
    } catch (err) {
        console.error('inbox insert failed: ' + err);
        // Fall back to a plain email so an enquiry is never lost.
        try {
            MailApp.sendEmail({
                to: TO_ADDRESS,
                replyTo: email,
                name: 'guanxin.de contact form',
                subject: subject,
                body: body
            });
            console.log('fallback: emailed to ' + TO_ADDRESS + ' (check Sent)');
        } catch (mailErr) {
            console.error('fallback MailApp.sendEmail failed: ' + mailErr);
            return false;
        }
    }

    return true;
}

/**
 * Gmail never puts mail you send to your own address into your inbox, so the
 * enquiry is not emailed at all: it is written straight into the mailbox as a
 * new unread message, from the visitor, labelled INBOX_LABEL. Reply goes to
 * the visitor. Uses no sending quota, and nothing leaves the account.
 *
 * Requires the advanced Gmail service: editor ▸ Services + ▸ Gmail API ▸ Add.
 */
function insertIntoInbox(subject, body, name, email) {
    // name/email are already newline-free (validated above), so they cannot
    // smuggle extra headers into the message.
    var raw = [
        'From: ' + encodeHeader(name + ' (guanxin.de contact form)') + ' <' + email + '>',
        'To: ' + TO_ADDRESS,
        'Reply-To: ' + email,
        'Subject: ' + encodeHeader(subject),
        'Date: ' + new Date().toUTCString(),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: base64',
        '',
        Utilities.base64Encode(body, Utilities.Charset.UTF_8)
    ].join('\r\n');

    var inserted = Gmail.Users.Messages.insert({
        labelIds: ['INBOX', 'UNREAD']
    }, 'me', Utilities.newBlob(raw, 'message/rfc822'));

    labelMessage(inserted.id);
    console.log('inbox insert: done (message ' + inserted.id + ')');
}

/** Adds INBOX_LABEL to a message, creating the label on first use. */
function labelMessage(messageId) {
    try {
        var label = GmailApp.getUserLabelByName(INBOX_LABEL) ||
            GmailApp.createLabel(INBOX_LABEL);
        GmailApp.getMessageById(messageId).getThread().addLabel(label);
    } catch (err) {
        console.error('labelling failed (message is still in the inbox): ' + err);
    }
}

/** RFC 2047 encoding, so non-ASCII names survive in headers. */
function encodeHeader(text) {
    if (/^[\x20-\x7E]*$/.test(text)) return '"' + text.replace(/"/g, '') + '"';
    return '=?UTF-8?B?' + Utilities.base64Encode(text, Utilities.Charset.UTF_8) + '?=';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function trim(value) {
    return (value || '').toString().trim();
}

/** Minimal no-JS fallback response — a thank-you/error page, not JSON. */
function thankYouPage(ok, lang) {
    var c = THANK_YOU_COPY[lang];
    var html = '<!doctype html><html lang="' + lang + '"><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<title>' + escapeHtml(ok ? c.successTitle : c.errorTitle) + '</title>' +
        '<body style="font-family:sans-serif;max-width:480px;margin:64px auto;padding:0 24px;">' +
        '<p>' + escapeHtml(ok ? c.successBody : c.errorBody) + '</p>' +
        '<p><a href="' + c.linkHref + '">' + escapeHtml(c.linkText) + '</a></p>' +
        '</body></html>';
    return HtmlService.createHtmlOutput(html);
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
}

function reject(field) {
    console.log('rejected: invalid ' + field);
    return false;
}

/**
 * Diagnostics — run this from the Apps Script editor (Run ▸ selfTest), then
 * open the execution log and your inbox. Writes one test enquiry straight
 * into the mailbox, exactly as a real submission does.
 */
function selfTest() {
    console.log('effective user: ' + Session.getEffectiveUser().getEmail());
    insertIntoInbox(
        '[guanxin.de] selfTest',
        'Test enquiry written by selfTest() in the Apps Script editor.',
        'selfTest',
        TO_ADDRESS
    );
}
