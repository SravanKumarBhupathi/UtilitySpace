export const knowledgeContent: Record<string, { html: string; relatedTopics?: { title: string; href: string; }[]; relatedTool?: { href: string; label: string; } }> = {
  'what-is-cloud-storage': {
    relatedTopics: [
      { title: "What is an IP Address?", href: "/knowledge/what-is-an-ip-address" },
      { title: "What is Wi-Fi?", href: "/knowledge/what-is-wi-fi" }
    ],
    html: `
      <h2>What it means</h2>
      <p>Cloud storage is a way of storing files on remote computers, usually called servers, that you access through the internet.</p>
      <p>Instead of keeping a file only on your phone or computer, you can store it with a cloud storage service and access it from supported devices.</p>

      <h2>Simple example</h2>
      <p>If you upload a photo to a cloud storage service, you may later be able to access that photo from another phone or computer by signing into the same account.</p>

      <h2>Why it matters</h2>
      <p>It can help you:</p>
      <ul>
        <li>Access files from different devices</li>
        <li>Keep additional copies of important files</li>
        <li>Share files with other people</li>
        <li>Free up some local device storage</li>
      </ul>
      <p>Cloud storage still depends on the service, account, internet access, and the storage plan available to you.</p>
    `
  },
  'what-is-ram': {
    relatedTopics: [
      { title: "What is an Operating System?", href: "/knowledge/what-is-an-operating-system" },
      { title: "What is Cache?", href: "/knowledge/what-is-cache" }
    ],
    html: `
      <h2>What it means</h2>
      <p>RAM stands for Random Access Memory.</p>
      <p>It is the short-term working memory used by a computer or other device while programs are running.</p>

      <h2>Simple example</h2>
      <p>When you open a browser, app, or document, the device uses RAM to keep information that needs to be accessed while you are using it.</p>

      <h2>Why it matters</h2>
      <p>Having enough RAM can help a device handle multiple active programs more comfortably.</p>
      <p>RAM is different from storage.</p>
      <p>Storage keeps files such as photos, videos, and applications for longer-term use. RAM is primarily used as temporary working memory while the device is operating.</p>
    `
  },
  'what-is-an-ip-address': {
    relatedTopics: [
      { title: "What is Wi-Fi?", href: "/knowledge/what-is-wi-fi" },
      { title: "What is a Domain Name?", href: "/knowledge/what-is-a-domain-name" }
    ],
    html: `
      <h2>What it means</h2>
      <p>An IP address is a numerical address associated with a device or network interface on an IP network.</p>
      <p>It helps network traffic identify where data should be sent.</p>

      <h2>Simple example</h2>
      <p>When your device communicates with another device or online service, network addressing helps data travel to the appropriate destination.</p>

      <h2>Are all IP addresses the same?</h2>
      <p>No.</p>
      <p>Two commonly discussed versions are IPv4 and IPv6.</p>
      <p>An IPv4 address looks like:</p>
      <pre>192.168.1.10</pre>
      <p>IPv6 addresses use a different, much longer format.</p>
    `
  },
  'what-is-an-api': {
    relatedTopics: [
      { title: "What is JSON?", href: "/guides/how-to-format-json" }
    ],
    relatedTool: { href: "/tools/developer/json-formatter", label: "Open JSON Formatter" },
    html: `
      <h2>What it means</h2>
      <p>API stands for Application Programming Interface.</p>
      <p>An API provides a defined way for different software systems to communicate and exchange information or request actions.</p>

      <h2>Simple example</h2>
      <p>Imagine a weather application that needs current weather information.</p>
      <p>The application can communicate with a weather service through an API and receive structured data that it can display.</p>

      <h2>Why it matters</h2>
      <p>APIs allow software systems to work together without requiring one application to directly understand all of another application's internal implementation.</p>
      <p>APIs are widely used in websites, mobile applications, cloud services, and software systems.</p>
    `
  },
  'what-is-a-web-browser': {
    relatedTopics: [
      { title: "What is a URL?", href: "/knowledge/what-is-a-url" },
      { title: "What is Cache?", href: "/knowledge/what-is-cache" }
    ],
    html: `
      <h2>What it means</h2>
      <p>A web browser is software used to access and interact with websites and web applications.</p>
      <p>Examples include browsers such as Chrome, Firefox, Edge, Safari, and others.</p>

      <h2>How it works</h2>
      <p>A browser can:</p>
      <ul>
        <li>Request webpages from web servers</li>
        <li>Display text and images</li>
        <li>Run web application code</li>
        <li>Store certain website data</li>
        <li>Allow users to interact with websites</li>
      </ul>

      <h2>Simple example</h2>
      <p>When you enter a website address into the browser, the browser communicates with the required web services and displays the resulting webpage.</p>
    `
  },
  'what-is-a-url': {
    relatedTopics: [
      { title: "What is a Domain Name?", href: "/knowledge/what-is-a-domain-name" },
      { title: "What is a Web Browser?", href: "/knowledge/what-is-a-web-browser" }
    ],
    relatedTool: { href: "/tools/developer/url-encoder", label: "Open URL Encoder/Decoder" },
    html: `
      <h2>What it means</h2>
      <p>URL stands for Uniform Resource Locator.</p>
      <p>A URL is an address used to identify and access a resource on a network, commonly on the web.</p>

      <h2>Simple example</h2>
      <pre>https://example.com/about</pre>
      <p>A URL can contain different parts, such as a protocol, domain, path, query parameters, and fragment.</p>

      <h2>Why it matters</h2>
      <p>URLs allow browsers and other software to identify where a web resource can be requested.</p>
    `
  },
  'what-is-a-domain-name': {
    relatedTopics: [
      { title: "What is a URL?", href: "/knowledge/what-is-a-url" },
      { title: "What is an IP Address?", href: "/knowledge/what-is-an-ip-address" }
    ],
    html: `
      <h2>What it means</h2>
      <p>A domain name is a human-readable name used to identify a website or other internet resource.</p>
      <p>For example:</p>
      <pre>example.com</pre>
      <p>is easier for people to remember than a numerical network address.</p>

      <h2>How it works</h2>
      <p>The domain name system, or DNS, helps translate domain names into information that networked systems can use to locate the appropriate service.</p>

      <h2>Why it matters</h2>
      <p>They make internet addresses easier for people to remember, communicate, and use.</p>
    `
  },
  'what-is-wi-fi': {
    relatedTopics: [
      { title: "What is an IP Address?", href: "/knowledge/what-is-an-ip-address" }
    ],
    html: `
      <h2>What it means</h2>
      <p>Wi-Fi is a technology that allows compatible devices to connect to a network wirelessly using radio communication.</p>

      <h2>Simple example</h2>
      <p>A typical home Wi-Fi network can connect devices such as:</p>
      <ul>
        <li>Phones</li>
        <li>Laptops</li>
        <li>TVs</li>
        <li>Tablets</li>
        <li>Smart devices</li>
      </ul>

      <h2>Does Wi-Fi mean internet?</h2>
      <p>Not exactly.</p>
      <p>Wi-Fi provides a wireless connection to a network.</p>
      <p>That network may provide internet access through a router or another connection, but Wi-Fi itself and the internet are different things.</p>
    `
  },
  'what-is-an-operating-system': {
    relatedTopics: [
      { title: "What is RAM?", href: "/knowledge/what-is-ram" }
    ],
    html: `
      <h2>What it means</h2>
      <p>An operating system is the main system software that manages a computer or other device and provides a platform for applications to run.</p>
      <p>Examples include:</p>
      <ul>
        <li>Windows</li>
        <li>macOS</li>
        <li>Linux</li>
        <li>Android</li>
        <li>iOS</li>
      </ul>

      <h2>How it works</h2>
      <p>It manages resources such as:</p>
      <ul>
        <li>Memory</li>
        <li>Storage</li>
        <li>Processes</li>
        <li>Hardware</li>
        <li>Files</li>
        <li>User interaction</li>
      </ul>

      <h2>Simple example</h2>
      <p>When you open an application on your phone, the operating system helps manage the application and provides access to the hardware and system resources it needs.</p>
    `
  },
  'what-is-cache': {
    relatedTopics: [
      { title: "What is RAM?", href: "/knowledge/what-is-ram" },
      { title: "What is a Web Browser?", href: "/knowledge/what-is-a-web-browser" }
    ],
    html: `
      <h2>What it means</h2>
      <p>A cache is temporary stored data that can help a system retrieve frequently needed information more quickly.</p>
      <p>Web browsers, applications, operating systems, and other systems can use caching.</p>

      <h2>Simple example</h2>
      <p>A browser may store certain website resources locally so that they do not always need to be downloaded again.</p>

      <h2>Why it matters</h2>
      <p>Sometimes cached data can become outdated or cause unexpected behavior.</p>
      <p>Clearing a cache can force an application or browser to retrieve fresh data.</p>
      <p>However, clearing cache does not automatically fix every technical problem.</p>
    `
  }
};
