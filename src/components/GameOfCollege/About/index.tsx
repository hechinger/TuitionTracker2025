export default function About() {
  return (
    <section id="goc-about-container">
      <div className="goc-prompt">
        <div data-role="content">
          <h2>Graduate debt-free?</h2>

          <p>
            It’s your junior year of high school, and you want to go to college. You’ve heard your salary can be a lot higher if you have a bachelor’s degree, but getting into a good school is difficult and finishing college is even harder. Plus, school can be pricey, so you want to ensure you’ll get a good education with little to no debt.
          </p>

          <h4>
            Pick your character traits and try to graduate without any student debt. What you pick will affect the difficulty. On mobile, choose your answers by swiping in the direction of the shown arrow.
          </h4>
        </div>

        <div data-role="buttons">
          <div
            className="goc-button"
            data-role="random"
          >
            Let’s do this!
          </div>
        </div>
      </div>
    </section>
  );
}
