import './SettingsMenu.css';

import {
  ChangeEvent,
  useContext,
  useState,
} from 'react';
import { fetchLessons, fetchVocabulary } from '../LanguageData/LanguageData';
import { UserContext } from '../User/User';
import { Tab } from '../Common/Tab';
import { Lesson } from '../Common/Lesson';
import { Word } from '../Common/Word';
import transliterateGreek from '../typescript/Transliterate';
import OptionCheckbox from './OptionCheckbox';

const LANGUAGE = 'gk';

function SettingsMenu(
  { tab: { title }, activeDeclensionId } : { tab: Tab, activeDeclensionId: number },
) {
  const { user, setUser } = useContext(UserContext);
  const [filter, setFilter] = useState('');

  if (title === 'Home') { return <span />; }
  const options : {
    id: number,
    name: string,
    type: string,
    isActive: boolean,
  }[] = [];

  if (title === 'Lessons') {
    const lessons = fetchLessons(LANGUAGE);

    options.push(
      ...lessons
        .filter((lsn: Lesson) => (
          filter === lsn.title.substring(0, filter.length)
        ))
        .map((lsn : Lesson) => ({
          id: lsn.lessonId,
          name: lsn.title,
          type: 'Lesson',
          isActive: !!user?.progress.lessons?.find(
            (prg) => prg.id === lsn.lessonId,
          )?.isComplete,
        })),
    );
  }
  if (title === 'Dictionary') {
    const vocabulary = fetchVocabulary(LANGUAGE);

    options.push(
      ...vocabulary
        .filter((vcb: Word) => (
          filter === transliterateGreek(
            vcb.content.substring(0, filter.length),
          )))
        .map((vcb : Word) => ({
          id: vcb.wordId,
          name: vcb.content,
          type: 'Word',
          isActive: !!user?.progress.vocabulary?.find(
            (prg) => prg.id === vcb.wordId,
          )?.isComplete,
        })),
    );
  }

  if (title === 'Details') {
    options.push({
      id: 1,
      type: 'Details',
      name: activeDeclensionId.toString(),
      isActive: true,
    });
  }

  const handleTextboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    settingId: number,
    settingType: string,
  ) => {
    /* Guards if no active user is set */
    if (!user) { return; }
    const updatedUser = {
      progress: {
        ...user.progress,
      },
    };
    /* Guards from non-existant settings */
    if (settingType !== 'Lesson' && settingType !== 'Word') { return; }
    const settingsTypeMap = { Lesson: 'lessons', Word: 'vocabulary' };
    const targetSettingType = settingsTypeMap[settingType];

    /* Selects the target list */
    if (targetSettingType !== 'lessons' && targetSettingType !== 'vocabulary') { return; }
    const targetProgressList = updatedUser.progress[targetSettingType];
    if (!targetProgressList) { return; }

    const targetProgressItem = targetProgressList.find((prg) => prg.id === settingId);
    if (!targetProgressItem) {
      targetProgressList.push({
        id: settingId,
        isComplete: e.target.checked,
      });
    } else {
      targetProgressItem.isComplete = e.target.checked;
    }

    setUser(updatedUser);
  };

  return (
    <div className="SettingsMenu">
      <div id={`${title}-menu`} className="SettingsMenuTab MenuActive">
        <h1 className="MenuTabTitle">{title}</h1>
        <input
          className="SettingsSearchBox"
          placeholder="Search"
          onChange={(e) => handleTextboxChange(e)}
        />
        {
          options.length !== 0
            ? options.map(({
              id,
              type,
              name,
              isActive,
            }) => (
              <OptionCheckbox
                id={id}
                key={`option-${type}-${id}`}
                type={type}
                name={name}
                value={isActive}
                onChange={(e) => handleCheckboxChange(e, id, type)}
              />
            ))
            : <span>No options match this search filter</span>
        }
      </div>
    </div>
  );
}

export default SettingsMenu;