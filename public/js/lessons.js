
import lessons from "../data/lessons.json" assert { type: "json" };

/** Initiates user without any lessons complete */
const userLessons = lessons.lessons;
userLessons.forEach((lsn) => lsn.isComplete = false);

/**
 * Initiate Lessons Menu Rendering
 */
(() => {
  const settingsMenu = document.getElementById("settings-menu");
  settingsMenu.textContent = "";

  const menuLabel = document.createElement("span");
  menuLabel.classList.add("menu-label");
  menuLabel.textContent = "Lessons";
  settingsMenu.appendChild(menuLabel);

  lessons.lessons.forEach((lsn) => {
    /* Creates span element for each literary unit */
    const settingsOption = document.createElement("input");
    settingsOption.setAttribute("type","checkbox");
    settingsOption.setAttribute("id",`lesson-${lsn.lessonId}`);
    settingsOption.classList.add("settings-option");
    settingsOption.dataset.lessonId = lsn.lessonId;

    settingsMenu.innerHTML = settingsMenu.innerHTML;
    settingsMenu.appendChild(settingsOption);

    const settingsLabel = document.createElement("label");
    settingsLabel.setAttribute("for",`lesson-${lsn.lessonId}`);
    settingsLabel.classList.add("settings-label");
    settingsLabel.textContent = lsn.title;

    settingsMenu.innerHTML = settingsMenu.innerHTML;
    settingsMenu.appendChild(settingsLabel);
  });
  /* Attaches listener for click events on text units */
  const settings = document.querySelectorAll('#settings-menu > input[type="checkbox"]');
  // console.log(settings)
  // const units = document.querySelectorAll("#testCheck");
  
  /* On change, update `userLessons` based on checkbox */
  settings.forEach((el) => el.addEventListener(
    "change",
    ({ currentTarget }) => {
      userLessons.find(
        (lsn) => lsn.lessonId == currentTarget.dataset.lessonId
      ).isComplete = currentTarget.checked;
    }
  ));
})();
