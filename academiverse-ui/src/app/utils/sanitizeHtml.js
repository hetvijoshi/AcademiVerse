const sanitizeHtml = (html) => {
    // Create a new div element
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Return the sanitized text content
    return doc.body.textContent || "";
};

export default sanitizeHtml; 