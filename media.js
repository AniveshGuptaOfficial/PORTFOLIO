/**
 * media.js — where every image / PDF on the site comes from.
 *
 * Media files are NOT stored in git. They live in the "media/" folder (ignored by
 * git). Upload that whole folder to Google Drive, then for each file:
 *   1. Right-click → Share → General access: "Anyone with the link" (Viewer).
 *      (Keep the folder itself restricted, so nobody can browse it.)
 *   2. Copy the link. It looks like
 *        https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing
 *      The part between /d/ and /view is the file ID.
 *   3. Paste that ID next to the file name below.
 *
 * If an ID is left empty, the site falls back to media/<file name> on your PC
 * (handy while developing — the files stay on disk, just not in git).
 */
window.MEDIA_IDS = {
  // ── Profile & education ──
  "Anivesh Gupta.jpg": "1A6jQfiIlWZgSlYF3pGAMPfQ9gYx20jUW",
  "national-high-school-cbse.jpeg": "1jDB-3p4QvhgYLseFAnwQOfgareqLSTMv",
  "national-high-school-wbbse.jpeg": "1YzVrfZuXA4b7cOC8QcHzu7hG8Y_VALiI",
  "Vellore-institute-of-technology.jpg": "1hZn6Qlr83u0MtW6HxgEeAiePkW4ILSiK",

  // ── Certificates ──
  "Anivesh_Gupta_certificate.png": "1jwEY36eYtBhlK4z9_fet7FkwMW_BnaoC",
  "Anivesh Gupta Web Development Workshop Certificate.jpg": "1MwvqmXTj7dUnmmZGWZwKcjS3ZYdiKdtF",
  "Anivesh Gupta Forests and their Management Certificate.jpg": "18Ngys8XHBD42j5rcSCWSYdRa7kLwCSKd",
  "Anivesh Gupta Data Structures and Algorithms Certificate.jpg": "1NvWS3L26UwadF8-ww3TbhvIab-1J4sNS",
  "Anivesh Gupta Cyber Security Certificate.jpg": "1b0PvTxzbRpC2cH7d-eORgKXq4v5ajDl8",
  "Anivesh Gupta Data Science BootCamp Certificate.jpg": "1CptVIgBJYT3_6ixKCsnt6vyQmd1-VkQx",
  "Anivesh Gupta Oracle Cloud Infrastructure 2025 AI Foundations Associate Certificate.jpg": "1Qyodeb1ULMdxDG-b5xIo7Sj3N6DtpAAG",
  "Anivesh Gupta Wild Life Ecology Certificate.jpg": "1qw_G2St7BF1ekNuHfiiyKfEYVG4hLd3z",
  "Anivesh Gupta Human Computer Interaction Certificate.jpg": "1wscyBBAK8K94UoY9djJyj-uJjvLMwbDR",
  "Anivesh Gupta IBM Java Developer Certificate.jpg": "1NaI_FM5Bmn_i7_AdlUA6zU8_zi2Y-Roj",
  "Anivesh Gupta Generative AI Certificate.jpg": "1hQ5FTTiAWreUEMn22AATTpw5iUBEAb3Q",

  // ── Reports & case studies ──
  "Caste Based Politics.pdf": "1LHaibbIa6NdpusGyCw-KyCzq_9_mrYpS",
  "HCI_Linguistics_Report.pdf": "",
  "Robotics For Engineers Report.pdf": "1S3UdxD4QUM7v7bN8tvmgCNb6U6TkNWF8",
  "Smart Inventory Management System.pdf": "1vrSfJMZCYU2w4KoyQyeUs9jfpgMXsIIo",
  "Strategic supply chain network optimization using Quantum Algorithm.pdf": "1GEW4VocBOE6owK2jh7boq4LJawOQ1dGi",
  "Bank Branch Networking.pdf": "1fyeSEcQy3OjGIDzglwJ_zcO0OBN2lZJd",
  "The Impact of Operating System Choices on DevOps Practices.pdf": "1qyvGKk0ZOPm5vEsByR3fJ7NNlQskwIXa",

  // ── Resume ──
  "Resume.pdf": "1YbxBUX2UzFKRu5FIz9KnamZOyC5S7IAo",
};

(function () {
  // Accept either a bare ID or a full Drive share link pasted by mistake
  function idFor(file) {
    var v = (window.MEDIA_IDS[file] || '').trim();
    var m = v.match(/\/d\/([\w-]+)/) || v.match(/[?&]id=([\w-]+)/);
    return m ? m[1] : v;
  }
  // Local copies live in the git-ignored "media/" folder next to index.html
  var local = function (file) { return encodeURI('media/' + file); };

  window.Media = {
    /** true when the file is served from Google Drive */
    isRemote: function (file) { return !!idFor(file); },
    /** URL usable in <img src> */
    img: function (file) {
      var id = idFor(file);
      return id ? 'https://lh3.googleusercontent.com/d/' + id : local(file);
    },
    /** URL usable in an <iframe> to preview a PDF (Drive's viewer works on phones too) */
    preview: function (file) {
      var id = idFor(file);
      return id ? 'https://drive.google.com/file/d/' + id + '/preview' : local(file);
    },
    /** URL to open the file in a new tab */
    open: function (file) {
      var id = idFor(file);
      return id ? 'https://drive.google.com/file/d/' + id + '/view' : local(file);
    },
    /** URL that downloads the file */
    download: function (file) {
      var id = idFor(file);
      return id ? 'https://drive.google.com/uc?export=download&id=' + id : local(file);
    },
  };
})();
