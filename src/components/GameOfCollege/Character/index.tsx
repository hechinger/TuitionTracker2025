export default function Character() {
  return (
    <section
      id="goc-character-container"
      className="short-height"
    >
      <div className="goc-prompt">
        <div data-role="content">
          <h2>Build Your Character</h2>
          <p>
            Your family’s income will be one of the biggest factors affecting your college journey. Tuition and fees, room and board, books and other costs can add up to thousands of dollars per year. Low-income students often receive a fraction of the financial aid needed to cover these expenses. The quality of your high school and whether your parents earned a degree can also affect your chances, determining whether you have the preparation and information for the admissions process and to succeed in college. Race plays a role, too. Students of color are underrepresented at colleges and universities with the most resources and overrepresented at less elite institutions with fewer supports to help them succeed.
          </p>
        </div>

        <div data-role="choices">
          <div className="goc-character-choice">
            <h4>Parental Income</h4>
            <select name="income">
              <option value="high">$110,000 or more</option>
              <option value="middle-high">$75,001-$110,000</option>
              <option value="middle">$48,001-$75,000</option>
              <option value="low">$30,001-$48,000</option>
              <option value="very-low">Less than $30,000</option>
            </select>
          </div>

          <div className="goc-character-choice">
            <h4>Parental Education</h4>
            <select name="parents">
              <option value="no-finish">Didn’t Finish College</option>					
              <option value="finished">Finished College</option>
            </select>
          </div>

          <div className="goc-character-choice">
            <h4>Race/Ethnicity</h4>
            <select name="race">
              <option value="asian">Asian</option>
              <option value="black">Black</option>
              <option value="latino">Latino</option>
              <option value="native">Native American</option>
              <option value="white">White</option>					
            </select>
          </div>
          <div className="goc-character-choice">
            <h4>High School</h4>
            <select name="school">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        <div data-role="buttons">
          <div className="goc-button" data-role="choices">Go with these options</div>
          <div className="goc-button" data-role="random">Pick for me</div>
        </div>
      </div>
    </section>
  );
}
