(async () => {

  const { tip } = await chrome.runtime.sendMessage({ greeting: "tip" });

  const mainContent = document.querySelector("#main-content");

  const tipWidget = createDomElement(`

      <div style="position:fixed;bottom:0;right:0;">
        <button class="no-visited" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0; border: none; background: none;>
          <div class="navigation-rail__icon">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="30" height="30" viewBox="0 0 30 30" fill="none"> 
            <path d='M15 16H9M14.5 9C14.5 7.61929 13.3807 6.5 12 6.5M6 9C6 11.2208 7.2066 13.1599 9 14.1973V18.5C9 19.8807 10.1193 21 11.5 21H12.5C13.8807 21 15 19.8807 15 18.5V14.1973C16.7934 13.1599 18 11.2208 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9Z'"></path>
            </svg>
          </div>
          <span>Tip</span> 
        </button>
      </div>
    `);

  const popover = createDomElement(
    `<div id="tip-popover" popover>${tip}</div>`
  );

  document.body.append(popover);

  mainContent.append(tipWidget);

})();

function createDomElement(html) {

  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild;

}
