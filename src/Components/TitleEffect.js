import { useEffect } from "react";

function TitleEffect() {
  useEffect(() => {
    let docTitle = document.title;
    const onBlur = () => {
      document.title = "Come Back :(";
    };
    const onFocus = () => {
      document.title = docTitle;
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}

export default TitleEffect;
