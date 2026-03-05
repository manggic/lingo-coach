import React, { useState, useEffect } from "react";

const languages = [
  { name: "English", code: "en" },
  { name: "हिंदी (Hindi)", code: "hi" },
  { name: "ગુજરાતી (Gujarati)", code: "gu" },
  { name: "বাংলা (Bengali)", code: "bn" },
  { name: "தமிழ் (Tamil)", code: "ta" },
  { name: "తెలుగు (Telugu)", code: "te" },
  { name: "ಕನ್ನಡ (Kannada)", code: "kn" },
  { name: "മലയാളം (Malayalam)", code: "ml" },
  { name: "ਪੰਜਾਬੀ (Punjabi)", code: "pa" },
  { name: "اردو (Urdu)", code: "ur" },
  { name: "অসমীয়া (Assam)", code: "as" },
  { name: "ଓଡ଼ିଆ (Odia)", code: "or" },
];

const Playground = ({ isOpen = true, onClose = false }) => {
  const [selectedLang, setSelectedLang] = useState("");
  const handleTranslate = () => {
    if (!selectedLang) return;
  
    document.cookie = `googtrans=/en/${selectedLang}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${selectedLang}; path=/;`;
  
    // Retry until the widget select is available
    const trySelect = (retries = 10) => {
      const googleSelect = document.querySelector(".goog-te-combo");
  
      if (googleSelect) {
        googleSelect.value = selectedLang;
        googleSelect.dispatchEvent(new Event("change"));
        onClose();
      } else if (retries > 0) {
        setTimeout(() => trySelect(retries - 1), 300); // retry every 300ms
      } else {
        console.error("Google Translate widget still not loaded after retries");
      }
    };
  
    trySelect();
  };

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'hi,gu,bn,ta,te,kn,ml,pa,ur,as,or,en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
  
      // ✅ Add this to confirm widget loaded
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo');
        console.log('Widget initialized, combo:', combo); // Should NOT be null now
      }, 1000);
    };
  
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div id="ovrlye" className="ovrlye notranslate" >
      <div className="ovrmdle" >
      <div id="google_translate_element" style={{ 
  position: "fixed", 
  top: "-9999px", 
  left: "-9999px" 
}}></div>

        <div className="mdlhdr">
          <div className="mdlttl">
            <span className="icon">
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.3302 4.45312H21.6933C22.3639 4.45312 22.9085 5.02366 22.9085 5.72621V21.6349L22.9024 21.7649C22.8443 22.3639 22.3891 22.8399 21.8174 22.9006L21.6933 22.908H12.1508L12.1488 22.9102L10.3265 18.456H10.537L10.536 18.4549H1.21518C0.54459 18.4549 1.07462e-06 17.8844 0 17.1818V1.27308C0 0.570537 0.54459 0 1.21518 0H9.71842L11.3302 4.45312ZM14.7317 13.8484L16.4309 8.72727H17.9156L20.8259 17.4545H19.1216L18.5003 15.4411H15.8523L15.6042 16.256L16.4004 18.456L11.6495 18.4549L11.6505 18.456H16.4004L13.1921 21.8171H21.6933C21.7888 21.8171 21.8672 21.735 21.8672 21.6349V5.72621C21.8672 5.62615 21.7888 5.54403 21.6933 5.54403H11.7258L14.7317 13.8484ZM5.10784 6.54545C4.77763 6.54545 4.46406 6.59008 4.16824 6.67862C3.87933 6.7672 3.61051 6.89154 3.36286 7.05256L3.70352 8.16477C3.91666 8.01991 4.12999 7.91127 4.34314 7.83878C4.55642 7.76632 4.77051 7.73011 4.98378 7.73011C5.21751 7.73018 5.39588 7.79052 5.51968 7.91122C5.65035 8.03198 5.71586 8.20469 5.71594 8.43004C5.71594 8.60725 5.67445 8.76032 5.59188 8.8892C5.50932 9.01803 5.36173 9.12661 5.14852 9.2152C4.93522 9.29574 4.63589 9.36076 4.2506 9.40909L4.43669 10.5085C4.79438 10.4774 5.11185 10.4157 5.38952 10.3295C5.47375 10.4138 5.55229 10.5013 5.62341 10.5938C5.80902 10.8272 5.90194 11.0928 5.90203 11.3906C5.902 11.6965 5.82317 11.9306 5.6651 12.0916C5.50683 12.2527 5.29281 12.3334 5.02446 12.3335C4.61858 12.3333 4.2635 12.1042 3.96079 11.6452C3.65801 11.1861 3.35877 10.4883 3.06288 9.55398L2.08259 10.0856C2.3785 10.9555 2.67771 11.6412 2.98051 12.1406C3.28315 12.6397 3.61003 12.9981 3.96079 13.2156C4.3186 13.425 4.71832 13.5298 5.15869 13.5298C5.72982 13.5298 6.18741 13.3563 6.53149 13.0099C6.88238 12.6556 7.05816 12.1684 7.05824 11.5483C7.05823 11.3655 7.03495 11.1902 6.98807 11.0231C7.13341 11.0422 7.27716 11.0518 7.41923 11.0518C7.64619 11.0518 7.8703 11.0277 8.09038 10.9794C8.12491 10.9718 8.15975 10.9619 8.19411 10.9528V14.1818H9.41234V7.82706H10.413V6.66584H7.51279V7.82706H8.19411V9.76278C8.10797 9.79381 8.02195 9.82301 7.93582 9.84482C7.68136 9.90115 7.42658 9.92895 7.17213 9.92898C6.98649 9.92898 6.80051 9.91688 6.61487 9.89276C6.5112 9.87409 6.41061 9.85185 6.31387 9.82777C6.3116 9.82537 6.30903 9.82269 6.30676 9.82031C6.69658 9.45262 6.89349 8.97408 6.8935 8.3821C6.8935 8.04397 6.83115 7.73754 6.70741 7.46378C6.59046 7.18215 6.39789 6.96002 6.12982 6.79901C5.86843 6.62992 5.52737 6.54553 5.10784 6.54545ZM16.2367 14.0977H18.12L17.1733 10.9336L16.2367 14.0977Z"
                  fill="black"
                />
              </svg>
            </span>
            <h3 className="frmtle">Language Translate into</h3>
          </div>
          <button className="mdlclsbt" onClick={onClose}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6406 1.17188L6.99219 5.82031L11.6406 10.4688L10.4688 11.6406L5.82031 6.99219L1.17188 11.6406L0 10.4688L4.64844 5.82031L0 1.17188L1.17188 0L5.82031 4.64844L10.4688 0L11.6406 1.17188Z"
                fill="#111111"
              />
            </svg>
          </button>
        </div>

        <div className="divider"></div>

        {/* <form onSubmit={handleTranslate}> */}
          <div className="lunglst">
            {languages.map(lang => (
              <label key={lang.code} className="frmrditm">
                <div className="lngtxtt">{lang.name}</div>
                <div className="cstminp">
                  <input
                    type="radio"
                    name="language"
                    value={lang.code}
                    onChange={e => setSelectedLang(e.target.value)}
                  />
                  <span className="frcstrdio"></span>
                </div>
              </label>
            ))}
          </div>

          <button
            type="submit"
            id="trnsbtne"
            className={selectedLang ? "active" : ""}
            disabled={!selectedLang}
            onClick={handleTranslate}
          >
            TRANSLATE
          </button>
        {/* </form> */}
      </div>

      <style jsx>{`
        #ovrlye {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 999999 !important; /* Isse header ke upar aayega */
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .ovrmdle {
          position: relative; /* Fixed se hta kar relative karein agar parent flex hai */
          background: #fff;
          width: 328px;
          max-height: 90vh;
          border-radius: 4px;
          padding: 24px;
          z-index: 1000000;
          margin: auto;
        }

        .mdlhdr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .mdlttl {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .frmtle {
          font-size: 16px;
          line-height: 23px;
          font-weight: 700;
          color: #111;
          margin: 0;
        }
        .mdlclsbt {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }
        .divider {
          height: 1px;
          background: #e2e2e2;
          margin: 16px 0 12px;
        }
        .lunglst {
          margin-bottom: 20px;
        }
        .frmrditm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          margin-bottom: 16px;
        }
        .frmrditm:last-child {
          margin-bottom: 0;
        }
        .lngtxtt {
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          color: #111;
        }
        .lngtxtt span {
          font-weight: 400;
          color: #666;
          font-size: 12px;
        }
        .frmrditm input {
          display: none;
        }
        .frcstrdio {
          width: 18px;
          height: 18px;
          border: 2px solid #909090;
          border-radius: 50%;
          position: relative;
          display: inline-block;
        }
        .frmrditm input:checked + .frcstrdio {
          border-color: #000;
        }
        .frmrditm input:checked + .frcstrdio::after {
          content: "";
          width: 10px;
          height: 10px;
          background: #000;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        #trnsbtne {
          font-size: 13px;
          font-weight: 600;
          color: #999;
          background: rgba(0, 0, 0, 0.1);
          width: 100%;
          height: 48px;
          border: none;
          outline: none;
          transition: 0.3s;
          border-radius: 4px;
        }
        #trnsbtne.active {
          background: #000;
          color: #fff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Playground;
