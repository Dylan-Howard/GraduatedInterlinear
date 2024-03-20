/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * TextRenderer
 */
import './TextRenderer.css';
import { useContext, useState } from 'react';
import TextUnit from './TextUnit';
import TextSelect from './TextSelect';
import { UserContext } from '../User/User';
import { TextContext, Unit } from '../LanguageData/Text';
import * as TextService from '../LanguageData/LanguageData';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = (message: any) => {
  // eslint-disable-next-line no-console
  console.log(message);
};

function TextControls(
  {
    chapterId,
    chapterPosition,
    onChange,
  }: {
    chapterId: number,
    chapterPosition: string | undefined,
    onChange: Function
  },
) {
  return (
    <div className={chapterPosition === 'first' ? 'TextControls InvertDirection' : 'TextControls'}>
      {
        chapterPosition !== 'first'
          ? (
            <button
              className="TextControlButton ButtonLeft"
              type="button"
              onClick={() => onChange(chapterId - 1)}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )
          : ''
      }
      {
        chapterPosition !== 'last'
          ? (
            <button
              className="TextControlButton ButtonRight"
              type="button"
              onClick={() => onChange(chapterId + 1)}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )
          : ''
      }
    </div>
  );
}

function TextRenderer(
  {
    // activeText,
    // setActiveText,
    changeActiveDeclension,
  } : {
    // activeText: { bookId: number, chapterId: number },
    // setActiveText: Function,
    changeActiveDeclension: Function,
  },
) {
  const { user } = useContext(UserContext);
  const { text, setText } = useContext(TextContext);
  // const [textUnits, setTextUnits] : [ Unit[], Function ] = useState([]);

  /* Sets the theme based on the user setting */
  const activeTheme = user?.settings.prefersDarkMode ? 'dark' : 'light';

  /* Sets the active text */
  const activeBook = TextService.fetchBookById(text.bookId);
  const activeChapter = TextService.fetchChapterById(text.chapterId);
  const activeUnits = TextService.fetchUnitsByChapterId(text.chapterId);

  /* Determines whether the text is Left-Right or Right-Left */
  const isRightToLeftText = !!(activeBook.title === 'Ruth');

  /* Determines the position of the active chapter within the active text */
  let chapterPosition;
  if (text.chapterId === 0) {
    chapterPosition = 'first';
  }
  if (text.chapterId === TextService.fetchMaxChapterId()) {
    chapterPosition = 'last';
  }

  const handleTextChange = (targetBookId: number) => {
    const targetBook = TextService.fetchBookById(targetBookId);
    if (!targetBook) { return; }

    setText({
      bookId: targetBookId,
      chapterId: targetBook.chapterIndicies.start,
    });
  };

  const handleChapterChange = (targetChapterId: number) => {
    /* Determines if the targetChapterIndex is within the current text.
     * If not, the chapter change should only change the text.
     */
    let targetBookId = text.bookId;
    if (targetChapterId < activeBook.chapterIndicies.start) {
      targetBookId -= 1;
    }
    if (targetChapterId > activeBook.chapterIndicies.end) {
      targetBookId += 1;
    }
    setText({
      bookId: targetBookId,
      chapterId: targetChapterId,
    });
  };

  const handleUnitClick = (morphologyId: number | undefined) => {
    changeActiveDeclension(morphologyId);
  };

  return (
    <div className={`TextContainer Text${activeTheme === 'light' ? 'Light' : 'Dark'}`}>
      <form className="TextRendererRow TextForm">
        <TextSelect
          activeOption={TextService.fetchBookById(activeBook.bookId).title}
          setOptionIndex={handleTextChange}
          options={TextService.fetchBookSelectionOptions()}
        />
        <TextSelect
          activeOption={activeChapter.chapterNumber}
          setOptionIndex={handleChapterChange}
          options={TextService.fetchChapterSelectionOptionsByBookId(activeBook.bookId)}
        />
      </form>
      <div className="TextRendererRow">
        <div className="TextRendererColumn">
          <div className={isRightToLeftText ? 'TextDisplay HebrewText' : 'TextDisplay'}>
            <h1 className="TextHeading">{`${activeBook.title} ${activeChapter.chapterNumber}`}</h1>
            {
              activeUnits.map((unt: Unit) => (
                <TextUnit
                  key={`unit-${unt.verseId}-${unt.unitId}`}
                  unit={unt}
                  onClick={() => handleUnitClick(unt.morphologyId)}
                />
              ))
            }
          </div>
        </div>
      </div>
      <div className="TextRendererRow">
        <div className="TextRendererColumn">
          <TextControls
            chapterId={text.chapterId}
            chapterPosition={chapterPosition}
            onChange={handleChapterChange}
          />
        </div>
      </div>
    </div>
  );
}

export default TextRenderer;
