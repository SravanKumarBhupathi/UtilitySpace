export const guideContent: Record<string, { html: string; relatedTool?: { href: string; label: string; } }> = {
  'how-to-compress-a-pdf': {
    relatedTool: { href: "/tools/pdf/compressor", label: "Open PDF Compressor" },
    html: `
      <h2>Why compress a PDF?</h2>
      <p>PDF files can become large when they contain high-resolution images, scanned pages, or other embedded resources. A large PDF can take longer to upload, download, email, or share.</p>
      <p>Compressing a PDF reduces its file size so it is easier to store and transfer.</p>

      <h2>How to compress a PDF</h2>
      <ol>
        <li>Open the PDF Compressor tool on UtilitySpace.</li>
        <li>Select or upload your PDF.</li>
        <li>Wait for the file to be processed.</li>
        <li>Review the resulting file size.</li>
        <li>Download the compressed PDF if the result meets your needs.</li>
      </ol>

      <h2>What affects PDF size?</h2>
      <p>Images are often one of the biggest contributors to PDF size. A document containing many high-resolution photographs or scanned pages may be much larger than a simple text-based PDF.</p>
      <p>Fonts, embedded resources, and the way the PDF was originally created can also affect its size.</p>

      <h2>Does compression always reduce quality?</h2>
      <p>Not necessarily. The result depends on how the PDF is compressed and what the original document contains.</p>
      <p>Image-heavy PDFs may require some reduction in image quality to achieve a significant reduction in file size. Text-based PDFs may behave differently.</p>

      <h2>Before sharing a compressed PDF</h2>
      <p>Open the resulting file and check:</p>
      <ul>
        <li>Text is readable.</li>
        <li>Important images are still clear enough.</li>
        <li>All pages are present.</li>
        <li>The file opens correctly.</li>
      </ul>
    `
  },
  'how-to-merge-pdf-files': {
    relatedTool: { href: "/tools/pdf/merger", label: "Open PDF Merger" },
    html: `
      <h2>Why merge PDF files?</h2>
      <p>If information is spread across several PDF documents, combining them into one file can make the collection easier to store, share, and organize.</p>
      <p>For example, you may want to combine:</p>
      <ul>
        <li>Multiple assignment pages</li>
        <li>Several scanned documents</li>
        <li>Reports and supporting documents</li>
        <li>Separate sections of a document</li>
      </ul>

      <h2>How to merge PDFs</h2>
      <ol>
        <li>Open the PDF Merger tool.</li>
        <li>Select the PDF files you want to combine.</li>
        <li>Arrange the files in the required order.</li>
        <li>Start the merge process.</li>
        <li>Download the combined PDF.</li>
        <li>Open the result and check the page order.</li>
      </ol>

      <h2>Check the order before merging</h2>
      <p>The order of the uploaded files determines how the final document is organized. Always review the order before processing.</p>

      <h2>After merging</h2>
      <p>Check:</p>
      <ul>
        <li>The expected number of pages is present.</li>
        <li>Pages appear in the correct order.</li>
        <li>The final PDF opens normally.</li>
        <li>Important content was not accidentally omitted.</li>
      </ul>
    `
  },
  'how-to-split-a-pdf': {
    relatedTool: { href: "/tools/pdf/splitter", label: "Open PDF Splitter" },
    html: `
      <h2>Why split a PDF?</h2>
      <p>A PDF may contain more pages than you need to share or submit. Splitting it allows you to work with only the pages you need.</p>
      <p>For example:</p>
      <ul>
        <li>Extract a particular section from a report.</li>
        <li>Separate selected pages from a scanned document.</li>
        <li>Create smaller documents from a large PDF.</li>
        <li>Share only the relevant pages.</li>
      </ul>

      <h2>How to split a PDF</h2>
      <ol>
        <li>Open the PDF Splitter.</li>
        <li>Select your PDF.</li>
        <li>Choose the pages or page ranges you want to extract.</li>
        <li>Start the process.</li>
        <li>Download the resulting PDF file or files.</li>
        <li>Open the output and verify the pages.</li>
      </ol>

      <h2>Be careful with page numbers</h2>
      <p>Check the PDF's page numbering carefully before entering page ranges. A document's printed page numbers may not always match the PDF viewer's page index.</p>

      <h2>Before downloading</h2>
      <p>Verify:</p>
      <ul>
        <li>Correct pages were selected.</li>
        <li>Pages are in the intended order.</li>
        <li>The resulting PDF opens correctly.</li>
      </ul>
    `
  },
  'jpg-images-to-pdf': {
    // Note: The app currently has image to image conversion, but not image to pdf. So we will not link an action tool or we'll report it.
    html: `
      <h2>Why convert JPG images to PDF?</h2>
      <p>Photos and scanned documents are often stored as separate image files. Converting them into a PDF can make them easier to organize as a single document.</p>
      <p>This can be useful for:</p>
      <ul>
        <li>Scanned notes</li>
        <li>Receipts</li>
        <li>Assignments</li>
        <li>Forms</li>
        <li>Document photographs</li>
      </ul>

      <h2>How to convert JPG images to PDF</h2>
      <ol>
        <li>Open the Image to PDF tool.</li>
        <li>Select your JPG images.</li>
        <li>Arrange them in the required order.</li>
        <li>Start the conversion.</li>
        <li>Download the generated PDF.</li>
        <li>Open it and check the pages.</li>
      </ol>

      <h2>Keep the image order correct</h2>
      <p>If you are converting multiple images, arrange them before creating the PDF. The order of the images determines the page order.</p>

      <h2>Check the final PDF</h2>
      <p>Make sure:</p>
      <ul>
        <li>Every required image is included.</li>
        <li>Pages are correctly ordered.</li>
        <li>Text within scanned images remains readable.</li>
        <li>The PDF opens normally.</li>
      </ul>
    `
  },
  'how-to-resize-an-image': {
    relatedTool: { href: "/tools/image/resizer", label: "Open Image Resizer" },
    html: `
      <h2>What does image resizing mean?</h2>
      <p>Image resizing changes the width and height of an image.</p>
      <p>For example, a large photograph can be resized to smaller dimensions before uploading it to a website or sharing it.</p>

      <h2>Why resize an image?</h2>
      <p>Common reasons include:</p>
      <ul>
        <li>Meeting upload dimension requirements.</li>
        <li>Reducing the size of large photographs.</li>
        <li>Preparing images for websites.</li>
        <li>Fitting images into documents.</li>
        <li>Making images easier to share.</li>
      </ul>

      <h2>How to resize an image</h2>
      <ol>
        <li>Open the Image Resizer.</li>
        <li>Upload your image.</li>
        <li>Enter the required width or height.</li>
        <li>Keep the aspect ratio locked when you want to avoid distortion.</li>
        <li>Process the image.</li>
        <li>Download the resized image.</li>
      </ol>

      <h2>Keep the aspect ratio in mind</h2>
      <p>Changing width and height independently can stretch or squash an image.</p>
      <p>When possible, preserve the original aspect ratio unless you specifically need exact dimensions.</p>

      <h2>Resizing vs compression</h2>
      <p>Resizing changes the image dimensions.</p>
      <p>Compression primarily attempts to reduce the amount of data used by the image.</p>
      <p>They are related, but they are not the same operation.</p>
    `
  },
  'png-to-jpg-guide': {
    relatedTool: { href: "/tools/image/converter", label: "Open Image Converter" },
    html: `
      <h2>PNG and JPG are different formats</h2>
      <p>PNG and JPG are both common image formats, but they are designed for different situations.</p>
      <p>PNG can support transparency and is commonly useful for graphics, screenshots, and images where preserving sharp edges is important.</p>
      <p>JPG is commonly used for photographs and can produce smaller files through lossy compression.</p>

      <h2>Why convert PNG to JPG?</h2>
      <p>You may want to convert a PNG when:</p>
      <ul>
        <li>A website requires JPG.</li>
        <li>You do not need transparency.</li>
        <li>You are working with photographs.</li>
        <li>You want a format commonly used for photo sharing.</li>
      </ul>

      <h2>Important: transparency</h2>
      <p>JPG does not support transparent backgrounds in the same way PNG does.</p>
      <p>If your PNG contains transparency, converting it to JPG requires that transparent areas be represented using a background color.</p>

      <h2>How to convert</h2>
      <ol>
        <li>Open the PNG to JPG converter.</li>
        <li>Upload the PNG image.</li>
        <li>Start the conversion.</li>
        <li>Download the JPG.</li>
        <li>Open the result and check the appearance.</li>
      </ol>
    `
  },
  'webp-to-jpg': {
    relatedTool: { href: "/tools/image/converter", label: "Open Image Converter" },
    html: `
      <h2>What is WebP?</h2>
      <p>WebP is an image format designed for efficient delivery on the web. It can provide smaller files while supporting modern image features.</p>
      <p>However, some older software, services, or workflows may work more conveniently with JPG.</p>

      <h2>Why convert WebP to JPG?</h2>
      <p>Conversion can be useful when:</p>
      <ul>
        <li>A service does not accept WebP.</li>
        <li>You need compatibility with older software.</li>
        <li>You are preparing an image for a workflow that specifically requires JPG.</li>
      </ul>

      <h2>How to convert WebP to JPG</h2>
      <ol>
        <li>Open the WebP to JPG converter.</li>
        <li>Upload the WebP image.</li>
        <li>Start the conversion.</li>
        <li>Download the JPG result.</li>
        <li>Check the output before using it elsewhere.</li>
      </ol>

      <h2>Remember</h2>
      <p>Converting between image formats can change how the image is encoded. If image quality is important, inspect the output before replacing the original.</p>
    `
  },
  'how-to-count-words-and-characters': {
    relatedTool: { href: "/tools/text/word-counter", label: "Open Word Counter" },
    html: `
      <h2>Why count words?</h2>
      <p>Some forms of writing have length requirements or practical limits.</p>
      <p>A word counter can help you quickly check whether your text is within the required range.</p>

      <h2>Why count characters?</h2>
      <p>Character counts are useful when a service limits the number of characters you can enter.</p>
      <p>This can be especially useful for:</p>
      <ul>
        <li>Short descriptions</li>
        <li>Form fields</li>
        <li>Social media content</li>
        <li>Titles</li>
        <li>Application fields</li>
      </ul>

      <h2>How to use a text counter</h2>
      <ol>
        <li>Open the Text Counter tool.</li>
        <li>Paste or type your text.</li>
        <li>Review the word and character counts.</li>
        <li>Edit your text if necessary.</li>
        <li>Copy the final version.</li>
      </ol>

      <h2>Counts can depend on the rules</h2>
      <p>Different applications can count words, characters, spaces, or line breaks differently.</p>
      <p>If a specific platform provides its own counting rules, use those rules as the final reference.</p>
    `
  },
  'how-to-format-json': {
    relatedTool: { href: "/tools/developer/json-formatter", label: "Open JSON Formatter" },
    html: `
      <h2>What is JSON?</h2>
      <p>JSON, or JavaScript Object Notation, is a text-based format commonly used for representing structured data.</p>
      <p>It can contain:</p>
      <ul>
        <li>Objects</li>
        <li>Arrays</li>
        <li>Strings</li>
        <li>Numbers</li>
        <li>Boolean values</li>
        <li>Null values</li>
      </ul>

      <h2>Why format JSON?</h2>
      <p>Minified JSON can be difficult to read because everything may appear on a small number of lines.</p>
      <p>Formatting adds indentation and line breaks, making the structure easier to inspect.</p>

      <h2>How to format JSON</h2>
      <ol>
        <li>Open the JSON Formatter.</li>
        <li>Paste your JSON.</li>
        <li>Run the formatting operation.</li>
        <li>Review the formatted result.</li>
        <li>Copy the result when ready.</li>
      </ol>

      <h2>What if the JSON is invalid?</h2>
      <p>A formatter should not silently produce a misleading result.</p>
      <p>If the input contains invalid JSON syntax, the tool should clearly indicate that the JSON could not be parsed and, where possible, provide a useful error location.</p>

      <h2>Common JSON mistakes</h2>
      <p>Watch for:</p>
      <ul>
        <li>Missing quotation marks</li>
        <li>Missing commas</li>
        <li>Extra commas</li>
        <li>Incorrect brackets</li>
        <li>Incorrect braces</li>
        <li>Invalid values</li>
      </ul>
    `
  },
  'how-to-calculate-percentage': {
    relatedTool: { href: "/calculators/percentage", label: "Open Percentage Calculator" },
    html: `
      <h2>What is a percentage?</h2>
      <p>A percentage represents a value as a part of 100.</p>
      <p>For example:</p>
      <p>25% means 25 out of 100.</p>

      <h2>Basic percentage formula</h2>
      <p>To find what percentage one number is of another:</p>
      <p>Percentage = (Part ÷ Whole) × 100</p>
      <p>Example:</p>
      <p>If you scored 45 marks out of 60:</p>
      <p>(45 ÷ 60) × 100 = 75%</p>
      <p>So the score is 75%.</p>

      <h2>Finding a percentage of a number</h2>
      <p>To find 20% of 500:</p>
      <p>20 ÷ 100 × 500 = 100</p>
      <p>Therefore, 20% of 500 is 100.</p>

      <h2>Where percentages are used</h2>
      <p>Percentages are common in:</p>
      <ul>
        <li>Exam marks</li>
        <li>Discounts</li>
        <li>Price changes</li>
        <li>Interest</li>
        <li>Statistics</li>
        <li>Business calculations</li>
        <li>Everyday comparisons</li>
      </ul>

      <h2>Use the UtilitySpace Percentage Calculator</h2>
      <p>For repeated or more complicated calculations, use the Percentage Calculator to reduce manual calculation errors.</p>
    `
  }
};
